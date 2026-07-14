import { useUserProfile } from './useUserSession';

const useCoinsData = () => {
  const { profile, loading, refreshProfile } = useUserProfile();

  return {
    coins: profile?.coins ?? 0,
    totalEarned: profile?.totalEarned ?? 0,

    dailyLogin: profile?.dailyLogin ?? {
      currentDay: 0,
      lastClaimAt: null,
    },

    scratchWin: profile?.scratchWin ?? {
      claimedCards: [],
      lastCompletedAt: null,
    },

    spinWheel: profile?.spinWheel ?? {
      spinsUsed: 0,
      lastResetAt: null,
      extraSpins: 0,
    },

    dailyStreak: profile?.dailyStreak ?? {
      count: 0,
      lastOpenAt: null,
    },
    transactions: profile?.transactions ?? 0,

    loading,
    refreshProfile,
  };
};

export default useCoinsData;
