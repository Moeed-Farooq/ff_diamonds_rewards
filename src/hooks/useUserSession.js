import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  getUserProfile,
  subscribeToAuthState,
  subscribeToUserProfile,
} from '../services/firebaseServices';
import { getSessionMode, SESSION_MODE } from '../services/sessionService';
import { isGuestProfile } from '../helpers';

const useUserSession = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [profile, setProfile] = useState(null);
  const [sessionMode, setSessionModeState] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(() => !getCurrentUser());
  const [isProfileLoading, setIsProfileLoading] = useState(() => !!getCurrentUser());
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    getSessionMode().then(mode => {
      if (mounted) {
        setSessionModeState(mode);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(
      authUser => {
        setUser(authUser);
        setIsAuthLoading(false);
      },
      authError => {
        setError(authError);
        setIsAuthLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    const unsubscribe = subscribeToUserProfile(
      user.uid,
      nextProfile => {
        setProfile(nextProfile);
        setIsProfileLoading(false);
      },
      profileError => {
        setError(profileError);
        setIsProfileLoading(false);
      },
    );

    return unsubscribe;
  }, [user?.uid]);

  const refreshProfile = useCallback(async () => {
    if (!user?.uid) {
      setProfile(null);
      return null;
    }

    setIsProfileLoading(true);

    try {
      const latestProfile = await getUserProfile(user.uid);
      setProfile(latestProfile);
      return latestProfile;
    } catch (refreshError) {
      setError(refreshError);
      throw refreshError;
    } finally {
      setIsProfileLoading(false);
    }
  }, [user?.uid]);

  const isGuest =
    sessionMode === SESSION_MODE.GUEST ||
    (sessionMode !== SESSION_MODE.ACTIVE && isGuestProfile(profile));

  return useMemo(
    () => ({
      user,
      profile,
      uid: user?.uid || null,
      isAnonymous: Boolean(user?.isAnonymous),
      username: profile?.username || '',
      gameId: profile?.gameId || '',
      isGuest,
      loading: isAuthLoading || isProfileLoading || sessionMode === null,
      isAuthLoading,
      isProfileLoading,
      error,
      refreshProfile,
    }),
    [
      user,
      profile,
      isGuest,
      isAuthLoading,
      isProfileLoading,
      sessionMode,
      error,
      refreshProfile,
    ],
  );
};

export const useCurrentUser = () => {
  const { user, uid, isAnonymous, loading, isAuthLoading, error } = useUserSession();

  return {
    user,
    uid,
    isAnonymous,
    loading,
    isAuthLoading,
    error,
  };
};

export const useUserProfile = () => {
  const {
    profile,
    uid,
    username,
    gameId,
    isGuest,
    loading,
    isProfileLoading,
    error,
    refreshProfile,
  } = useUserSession();

  return {
    profile,
    uid,
    username,
    gameId,
    isGuest,
    loading,
    isProfileLoading,
    error,
    refreshProfile,
  };
};

export default useUserSession;
