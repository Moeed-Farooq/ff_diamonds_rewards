import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_COLLECTIONS } from '../enums';
import { weeklyRewards, scratchRewards } from '../dummies';
import { canSpinWheel, canPlayScratch } from '../helpers';

const usersCollection = firestore().collection(
  FIREBASE_COLLECTIONS.USERS_COLLECTION,
);

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
    transactions: 0,
    dailyLogin: {
      currentDay: 0,
      lastClaimAt: null,
    },
    scratchWin: {
      claimedCards: [],
      lastCompletedAt: null,
      extraScratches: 0,
    },
    spinWheel: {
      spinsUsed: 0,
      lastResetAt: null,
      extraSpins: 0,
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
        extraScratches: 0,
      };
    } else if (existingProfile.scratchWin.extraScratches === undefined) {
      updates.scratchWin = {
        ...existingProfile.scratchWin,
        extraScratches: 0,
      };
    }
    if (!existingProfile.spinWheel) {
      updates.spinWheel = {
        spinsUsed: 0,
        lastResetAt: null,
        extraSpins: 0,
      };
    } else if (existingProfile.spinWheel.extraSpins === undefined) {
      updates.spinWheel = {
        ...existingProfile.spinWheel,
        extraSpins: 0,
      };
    }
    if (!existingProfile.dailyStreak) {
      updates.dailyStreak = {
        count: 0,
        lastOpenAt: null,
      };
    }
    if (existingProfile.transactions === undefined) {
      updates.transactions = 0;
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

const normalizeCoins = coins => {
  const value = Number(coins);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Coins must be a positive number.');
  }

  return Math.floor(value);
};

const sanitizeText = (value, fallback = null) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const nextValue = value.trim();
  return nextValue.length ? nextValue : fallback;
};

const normalizeTransactionType = value =>
  sanitizeText(value, 'bonus')?.toLowerCase().replace(/\s+/g, '_') || 'bonus';

export const awardCoinsWithTransaction = async ({
  uidParam,
  coins,
  profileUpdates = {},
  type,
  title,
  screen,
  game,
  rewardSource,
} = {}) => {
  const uid = uidParam || getCurrentUser()?.uid;

  if (!uid) {
    throw new Error('User not found.');
  }

  const coinsToAdd = normalizeCoins(coins);
  const userRef = usersCollection.doc(uid);
  const transactionRef = userRef.collection('transactions').doc();
  let balanceAfterTransaction = 0;

  await firestore().runTransaction(async transaction => {
    const snapshot = await transaction.get(userRef);

    if (!snapshot.exists) {
      throw new Error('Profile not found.');
    }

    const profile = snapshot.data() || {};
    const nextBalance = (profile.coins || 0) + coinsToAdd;
    const nextTotalEarned = (profile.totalEarned || 0) + coinsToAdd;
    const nextTransactionCount = (profile.transactions || 0) + 1;

    balanceAfterTransaction = nextBalance;

    transaction.set(
      userRef,
      {
        ...profileUpdates,
        coins: nextBalance,
        totalEarned: nextTotalEarned,
        transactions: nextTransactionCount,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const transactionType = normalizeTransactionType(type);
    const resolvedTitle =
      sanitizeText(title) ||
      sanitizeText(rewardSource) ||
      `${transactionType.replace(/_/g, ' ')} reward`;

    transaction.set(transactionRef, {
      type: transactionType,
      title: resolvedTitle,
      coins: coinsToAdd,
      screen: sanitizeText(screen),
      game: sanitizeText(game),
      rewardSource: sanitizeText(rewardSource, resolvedTitle),
      balanceAfterTransaction: nextBalance,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  });

  return {
    coinsAdded: coinsToAdd,
    balanceAfterTransaction,
  };
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
  const dayNumber = dailyLogin.currentDay + 1;
  const nextDay = (dailyLogin.currentDay + 1) % 7;

  await awardCoinsWithTransaction({
    uidParam: uid,
    coins: reward,
    type: 'daily',
    title: `Daily Login Bonus - Day ${dayNumber}`,
    screen: 'DailyLoginScreen',
    game: 'Daily Login',
    rewardSource: 'Daily Login Bonus',
    profileUpdates: {
      dailyLogin: {
        currentDay: nextDay,
        lastClaimAt: firestore.FieldValue.serverTimestamp(),
      },
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
    extraScratches: 0,
  };

  let claimedCards = [...(scratchWin.claimedCards || [])];
  let lastCompletedAt = scratchWin.lastCompletedAt || null;
  let extraScratches = Math.max(0, Number(scratchWin.extraScratches) || 0);

  // 24 hours complete - start a fresh daily cycle
  if (lastCompletedAt && canPlayScratch(lastCompletedAt)) {
    claimedCards = [];
    lastCompletedAt = null;
    extraScratches = 0;
  }

  const inCooldown = !!lastCompletedAt && !canPlayScratch(lastCompletedAt);

  if (claimedCards.includes(cardId)) {
    return;
  }

  if (inCooldown) {
    if (extraScratches <= 0) {
      throw new Error('No scratches left');
    }

    await awardCoinsWithTransaction({
      uidParam: uid,
      coins: reward,
      type: 'scratch',
      title: `Scratch & Win - ${reward} coins`,
      screen: 'ScratchWinScreen',
      game: 'Scratch & Win',
      rewardSource: 'Scratch Card',
      profileUpdates: {
        scratchWin: {
          claimedCards: [...claimedCards, cardId],
          lastCompletedAt,
          extraScratches: extraScratches - 1,
        },
      },
    });

    return;
  }

  const nextClaimedCards = [...claimedCards, cardId];

  let updates = {
    scratchWin: {
      claimedCards: nextClaimedCards,
      lastCompletedAt,
      extraScratches,
    },
  };

  // All daily cards complete - start cooldown
  if (nextClaimedCards.length >= scratchRewards.length) {
    updates = {
      scratchWin: {
        claimedCards: [],
        lastCompletedAt: firestore.FieldValue.serverTimestamp(),
        extraScratches: 0,
      },
    };
  }

  await awardCoinsWithTransaction({
    uidParam: uid,
    coins: reward,
    type: 'scratch',
    title: `Scratch & Win - ${reward} coins`,
    screen: 'ScratchWinScreen',
    game: 'Scratch & Win',
    rewardSource: 'Scratch Card',
    profileUpdates: updates,
  });
};

export const grantExtraScratchFromRewardedAd = async () => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    throw new Error('User not found.');
  }

  const userRef = usersCollection.doc(uid);

  await firestore().runTransaction(async transaction => {
    const snapshot = await transaction.get(userRef);

    if (!snapshot.exists) {
      throw new Error('Profile not found.');
    }

    const profile = snapshot.data() || {};
    const scratchWin = profile.scratchWin || {
      claimedCards: [],
      lastCompletedAt: null,
      extraScratches: 0,
    };

    let claimedCards = [...(scratchWin.claimedCards || [])];
    let lastCompletedAt = scratchWin.lastCompletedAt || null;
    let extraScratches = Math.max(0, Number(scratchWin.extraScratches) || 0);

    if (lastCompletedAt && canPlayScratch(lastCompletedAt)) {
      claimedCards = [];
      lastCompletedAt = null;
      extraScratches = 0;
    }

    const inCooldown = !!lastCompletedAt && !canPlayScratch(lastCompletedAt);

    // Only grant extras while daily scratches are on cooldown.
    if (!inCooldown) {
      return;
    }

    extraScratches += 1;

    transaction.set(
      userRef,
      {
        scratchWin: {
          claimedCards,
          lastCompletedAt,
          extraScratches,
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
};

export const claimSpinReward = async reward => {
  const profile = await getUserProfile();

  if (!profile) {
    throw new Error('Profile not found.');
  }

  const spinWheel = profile.spinWheel || {
    spinsUsed: 0,
    lastResetAt: null,
    extraSpins: 0,
  };

  let spinsUsed = spinWheel.spinsUsed;
  let lastResetAt = spinWheel.lastResetAt;
  let extraSpins = Math.max(0, Number(spinWheel.extraSpins) || 0);

  if (lastResetAt && canSpinWheel(lastResetAt)) {
    spinsUsed = 0;
    lastResetAt = null;
    extraSpins = 0;
  }

  const hasDailySpinLeft = spinsUsed < 5;
  const hasExtraSpinLeft = extraSpins > 0;

  if (!hasDailySpinLeft && !hasExtraSpinLeft) {
    throw new Error('No spins left');
  }

  if (hasDailySpinLeft) {
    spinsUsed++;
  } else {
    // Daily spins are exhausted; consume one persisted ad-earned extra spin.
    extraSpins -= 1;
  }

  await awardCoinsWithTransaction({
    coins: reward,
    type: 'spin',
    title: `Spin & Win - ${reward} coins`,
    screen: 'SpinWinScreen',
    game: 'Spin & Win',
    rewardSource: 'Spin Wheel',
    profileUpdates: {
      spinWheel: {
        spinsUsed,
        lastResetAt:
          spinsUsed === 5 && !lastResetAt
            ? firestore.FieldValue.serverTimestamp()
            : lastResetAt,
        extraSpins,
      },
    },
  });
};

export const grantExtraSpinFromRewardedAd = async () => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    throw new Error('User not found.');
  }

  const userRef = usersCollection.doc(uid);

  await firestore().runTransaction(async transaction => {
    const snapshot = await transaction.get(userRef);

    if (!snapshot.exists) {
      throw new Error('Profile not found.');
    }

    const profile = snapshot.data() || {};
    const spinWheel = profile.spinWheel || {
      spinsUsed: 0,
      lastResetAt: null,
      extraSpins: 0,
    };

    let spinsUsed = Number(spinWheel.spinsUsed) || 0;
    let lastResetAt = spinWheel.lastResetAt || null;
    let extraSpins = Math.max(0, Number(spinWheel.extraSpins) || 0);

    if (lastResetAt && canSpinWheel(lastResetAt)) {
      spinsUsed = 0;
      lastResetAt = null;
      extraSpins = 0;
    }

    // Only grant extra spin when regular daily spins are fully used.
    if (spinsUsed < 5) {
      return;
    }

    extraSpins += 1;

    transaction.set(
      userRef,
      {
        spinWheel: {
          spinsUsed,
          lastResetAt,
          extraSpins,
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
};

export const updateDailyStreak = async () => {
  const uid = getCurrentUser()?.uid;
  if (!uid) {
    return {
      count: 0,
      lastOpenAt: null,
    };
  }

  const profile = await getUserProfile(uid);
  if (!profile) {
    return {
      count: 0,
      lastOpenAt: null,
    };
  }

  const streak = profile.dailyStreak || {
    count: 0,
    lastOpenAt: null,
  };

  const parseDate = value => {
    if (!value) {
      return null;
    }

    if (typeof value?.toDate === 'function') {
      return value.toDate();
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getUtcDayStart = date =>
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

  const now = new Date();
  const lastOpenDate = parseDate(streak.lastOpenAt);
  const currentCount = Math.max(0, Number(streak.count) || 0);

  if (lastOpenDate) {
    const dayDifference = Math.floor(
      (getUtcDayStart(now) - getUtcDayStart(lastOpenDate)) / DAY_IN_MILLISECONDS,
    );

    // Bug was here before: count was hardcoded to 1 on every launch.
    // We now update streak only once per calendar day.
    if (dayDifference <= 0) {
      return streak;
    }

    const nextCount = dayDifference === 1 ? currentCount + 1 : 1;

    await updateUserProfile(uid, {
      dailyStreak: {
        count: nextCount,
        lastOpenAt: firestore.FieldValue.serverTimestamp(),
      },
    });

    return {
      count: nextCount,
      lastOpenAt: streak.lastOpenAt,
    };
  }

  // First tracked app-open for streak data.
  await updateUserProfile(uid, {
    dailyStreak: {
      count: 1,
      lastOpenAt: firestore.FieldValue.serverTimestamp(),
    },
  });

  return {
    count: 1,
    lastOpenAt: streak.lastOpenAt,
  };
};


export const addCoins = async (coins, transactionMeta = {}) => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    return null;
  }

  return awardCoinsWithTransaction({
    uidParam: uid,
    coins,
    type: transactionMeta.type || 'bonus',
    title: transactionMeta.title,
    screen: transactionMeta.screen,
    game: transactionMeta.game,
    rewardSource: transactionMeta.rewardSource,
  });
};

const toDate = value => {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeTransaction = (id, data = {}) => {
  const createdAt = toDate(data.createdAt || data.timestamp || data.date);

  return {
    id: String(id),
    type: normalizeTransactionType(data.type),
    title: sanitizeText(data.title, sanitizeText(data.rewardSource, 'Reward')),
    coins: toNumber(data.coins),
    createdAt,
    screen: sanitizeText(data.screen, ''),
    game: sanitizeText(data.game, ''),
    rewardSource: sanitizeText(data.rewardSource, ''),
  };
};

export const subscribeToCurrentUserTransactions = (onNext, onError) => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    onNext([]);
    return () => {};
  }

  const userDocRef = usersCollection.doc(uid);

  return userDocRef
    .collection('transactions')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      querySnapshot => {
        const transactions = querySnapshot.docs.map(doc =>
          normalizeTransaction(doc.id, doc.data() || {}),
        );

        onNext(transactions);
      },
      error => {
        if (typeof onError === 'function') {
          onError(error);
        }
      },
    );
};


export const subscribeToCurrentUserData = callback => {
  const uid = getCurrentUser()?.uid;

  if (!uid) {
    return () => {};
  }

  return usersCollection.doc(uid).onSnapshot(snapshot => {
    if (!snapshot.exists) {
      callback(null);
      return;
    }

    callback({
      id: snapshot.id,
      ...snapshot.data(),
    });
  });
};