import { useCallback, useState } from 'react';
import { initializeMobileAds, rewardedService } from '../services/ads';

const useRewardedAd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const showRewardedAd = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await initializeMobileAds();
      rewardedService.initialize();

      return await rewardedService.show();
    } catch (adError) {
      setError(adError);
      console.log('Rewarded hook error:', adError?.message || adError);

      return {
        shown: false,
        rewardEarned: false,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    showRewardedAd,
    isLoading,
    error,
  };
};

export default useRewardedAd;
