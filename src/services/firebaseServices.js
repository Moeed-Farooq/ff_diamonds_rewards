import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_COLLECTIONS } from '../enums';
import { weeklyRewards, scratchRewards } from '../dummies';
import { canSpinWheel } from '../helpers';

const usersCollection = firestore().collection(
  FIREBASE_COLLECTIONS.USERS_COLLECTION,
);

const { FieldValue } = firestore;

const isNonEmptyString = value =>
  typeof value === 'string' && value.trim().length > 0;

export const getCurrentUser = () => auth().currentUser;

export const subscribeToAuthState = (onNext, onError) =>
  auth().onAuthStateChanged(onNext, onError);

export const anonymousLogin = async () => {
  const user = getCurrentUser();

  if (user) {
    return user;
  }

  const credential = await auth().signInAnonymously();
  return credential.user;
};

export const getUserProfile = async uidParam => {
  const uid = uidParam || getCurrentUser()?.uid;

  if (!uid) {
    return null;
  }

  const profileDocument = await usersCollection.doc(uid).get();

  if (!profileDocument.exists) {
    return null;
  }

  return {
    id: profileDocument.id,
    ...profileDocument.data(),
  };
};

export const subscribeToUserProfile = (uid, onNext, onError) => {
  if (!uid) {
    return () => {};
  }

  return usersCollection.doc(uid).onSnapshot(profileDocument => {
    if (!profileDocument.exists) {
      onNext(null);
      return;
    }

    onNext({
      id: profileDocument.id,
      ...profileDocument.data(),
    });
  }, onError);
};

export const createUserProfile = async ({
  uid: uidParam,
  username,
  gameId,
}) => {
  const uid = uidParam || getCurrentUser()?.uid;
  const normalizedGameId = (gameId || '').trim();

  if (!uid) {
    throw new Error('Unable to create profile without an authenticated user.');
  }

  if (!isNonEmptyString(username)) {
    throw new Error('Username is required.');
  }

  if (!isNonEmptyString(normalizedGameId)) {
    throw new Error('Game ID is required.');
  }

  const serverTime = firestore.FieldValue.serverTimestamp();

  const profilePayload = {
    uid,
    username,
    gameId: normalizedGameId,
    coins: 0,
    totalEarned: 0,
    dailyLogin: {
      currentDay: 0,
      lastClaimAt: null,
    },
    scratchWin: {
      claimedCards: [],
      lastCompletedAt: null,
    },
    spinWheel: {
      spinsUsed: 0,
      lastResetAt: null,
    },
    dailyStreak: {
      count: 0,
      lastOpenAt: null,
    },
    createdAt: serverTime,
    updatedAt: serverTime,
  };

  await usersCollection.doc(uid).set(profilePayload);

  return profilePayload;
};

export const updateUserProfile = async (uidParam, updates = {}) => {
  const uid = uidParam || getCurrentUser()?.uid;

  if (!uid) {
    throw new Error('Unable to update profile without an authenticated user.');
  }

  const nextUpdates = { ...updates };

  if (typeof nextUpdates.gameId === 'string') {
    nextUpdates.gameId = nextUpdates.gameId.trim();
  }

  Object.keys(nextUpdates).forEach(key => {
    if (nextUpdates[key] === undefined) {
      delete nextUpdates[key];
    }
  });

  await usersCollection.doc(uid).set(
    {
      ...nextUpdates,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
};

const isValidProfile = (profile, uid) => {
  if (!profile) {
    return false;
  }

  return (
    profile.uid === uid &&
    isNonEmptyString(profile.username) &&
    isNonEmptyString(profile.gameId)
  );
};

export const ensureUserProfile = async profilePayload => {
  const user = await anonymousLogin();
  const existingProfile = await getUserProfile(user.uid);

  if (isValidProfile(existingProfile, user.uid)) {
    const updates = {};

    if (existingProfile.coins === undefined) {
      updates.coins = 0;
    }

    if (existingProfile.totalEarned === undefined) {
      updates.totalEarned = 0;
    }

    if (!existingProfile.dailyLogin) {
      updates.dailyLogin = {
        currentDay: 0,
        lastClaimAt: null,
      };
    }
    if (!existingProfile.scratchWin) {
      updates.scratchWin = {
        claimedCards: [],
        lastCompletedAt: null,
      };
    }
    if (!existingProfile.spinWheel) {
      updates.spinWheel = {
        spinsUsed: 0,
        lastResetAt: null,
      };
    }
    if (!existingProfile.dailyStreak) {
      updates.dailyStreak = {
        count: 0,
        lastOpenAt: null,
      };
    }

    if (Object.keys(updates).length) {
      await updateUserProfile(user.uid, updates);
    }
    return {
      user,
      profile: existingProfile,
      isNewProfile: false,
    };
  }

  if (!profilePayload) {
    return {
      user,
      profile: null,
      isNewProfile: false,
    };
  }

  await createUserProfile({
    uid: user.uid,
    username: profilePayload.username,
    gameId: profilePayload.gameId,
  });

  const nextProfile = await getUserProfile(user.uid);

  return {
    user,
    profile: nextProfile,
    isNewProfile: true,
  };
};

export const hasCompletedOnboarding = async () => {
  let user = getCurrentUser();

  if (!user) {
    user = await new Promise((resolve, reject) => {
      const unsubscribe = subscribeToAuthState(
        authUser => {
          unsubscribe();
          resolve(authUser);
        },
        error => {
          unsubscribe();
          reject(error);
        },
      );
    });
  }

  if (!user || !user.isAnonymous) {
    return {
      isCompleted: false,
      user,
      profile: null,
    };
  }

  const profile = await getUserProfile(user.uid);
  console.log(profile.dailyStreak);
  await updateDailyStreak();

  return {
    isCompleted: isValidProfile(profile, user.uid),
    dailyStreak: profile?.dailyStreak ?? {
      count: 0,
      lastOpenAt: null,
    },
    user,
    profile,
  };
};

export const logoutUser = async () => {
  if (getCurrentUser()) {
    await auth().signOut();
  }
};

export const claimDailyLoginReward = async () => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    throw new Error('User not found');
  }

  const profile = await getUserProfile(uid);

  if (!profile) {
    throw new Error('Profile not found');
  }

  const dailyLogin = profile.dailyLogin || {
    currentDay: 0,
    lastClaimAt: null,
  };

  const lastClaim =
    dailyLogin.lastClaimAt?.toDate?.() ||
    (dailyLogin.lastClaimAt ? new Date(dailyLogin.lastClaimAt) : null);

  if (lastClaim) {
    const now = Date.now();
    const nextClaim = lastClaim.getTime() + 24 * 60 * 60 * 1000;

    if (now < nextClaim) {
      throw new Error('Reward already claimed.');
    }
  }

  const reward = weeklyRewards[dailyLogin.currentDay];

  const nextDay = (dailyLogin.currentDay + 1) % 7;

  await updateUserProfile(uid, {
    coins: (profile.coins || 0) + reward,
    totalEarned: (profile.totalEarned || 0) + reward,
    dailyLogin: {
      currentDay: nextDay,
      lastClaimAt: firestore.FieldValue.serverTimestamp(),
    },
  });

  return reward;
};

export const claimScratchReward = async (cardId, reward) => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    throw new Error('User not found.');
  }

  const userRef = usersCollection.doc(uid);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    throw new Error('Profile not found.');
  }

  const profile = snapshot.data();

  const scratchWin = profile.scratchWin || {
    claimedCards: [],
    lastCompletedAt: null,
  };

  // 24 hours complete ho chuke hain to reset
  if (
    scratchWin.lastCompletedAt &&
    Date.now() - scratchWin.lastCompletedAt.toDate().getTime() >=
      24 * 60 * 60 * 1000
  ) {
    scratchWin.claimedCards = [];
    scratchWin.lastCompletedAt = null;
  }

  // Already claimed
  if (scratchWin.claimedCards.includes(cardId)) {
    return;
  }

  const nextClaimedCards = [...scratchWin.claimedCards, cardId];

  const updates = {
    coins: (profile.coins || 0) + reward,
    totalEarned: (profile.totalEarned || 0) + reward,
    scratchWin: {
      claimedCards: nextClaimedCards,
      lastCompletedAt: scratchWin.lastCompletedAt,
    },
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  // Sab cards complete
  if (nextClaimedCards.length >= scratchRewards.length) {
    updates.scratchWin = {
      claimedCards: [],
      lastCompletedAt: firestore.FieldValue.serverTimestamp(),
    };
  }

  await userRef.update(updates);
};

export const claimSpinReward = async reward => {
  const profile = await getUserProfile();

  const spinWheel = profile.spinWheel || {
    spinsUsed: 0,
    lastResetAt: null,
  };

  let spinsUsed = spinWheel.spinsUsed;
  let lastResetAt = spinWheel.lastResetAt;

  if (lastResetAt && canSpinWheel(lastResetAt)) {
    spinsUsed = 0;
    lastResetAt = null;
  }

  if (spinsUsed >= 5) {
    throw new Error('No spins left');
  }

  spinsUsed++;

  await updateUserProfile(null, {
    coins: (profile.coins || 0) + reward,
    totalEarned: (profile.totalEarned || 0) + reward,

    spinWheel: {
      spinsUsed,
      lastResetAt:
        spinsUsed === 5 ? firestore.FieldValue.serverTimestamp() : lastResetAt,
    },
  });
};

export const updateDailyStreak = async () => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    return;
  }

  const profile = await getUserProfile(uid);

  if (!profile) {
    return;
  }

  const streak = profile.dailyStreak || {
    count: 0,
    lastOpenAt: null,
  };

  const now = new Date();

  if (!streak.lastOpenAt) {
    await updateUserProfile(uid, {
      dailyStreak: {
        count: 1,
        lastOpenAt: firestore.FieldValue.serverTimestamp(),
      },
    });
    return;
  }

  const last =
    typeof streak.lastOpenAt?.toDate === 'function'
      ? streak.lastOpenAt.toDate()
      : new Date(streak.lastOpenAt);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  const difference =
    (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24);

  // Same day
  if (difference === 0) {
    return;
  }

  // Consecutive day
  if (difference === 1) {
    await updateUserProfile(uid, {
      dailyStreak: {
        count: streak.count + 1,
        lastOpenAt: firestore.FieldValue.serverTimestamp(),
      },
    });

    return;
  }

  // Missed one or more days
  await updateUserProfile(uid, {
    dailyStreak: {
      count: 1,
      lastOpenAt: firestore.FieldValue.serverTimestamp(),
    },
  });
};
