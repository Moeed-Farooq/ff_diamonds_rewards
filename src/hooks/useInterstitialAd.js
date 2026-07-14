import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { initializeMobileAds, interstitialService } from '../services/ads';

const useInterstitialAd = (enabled = true) => {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return () => {};
      }

      let isActive = true;

      const showAd = async () => {
        await initializeMobileAds();

        if (!isActive) {
          return;
        }

        interstitialService.initialize();
        await interstitialService.showIfReady();
      };

      showAd().catch(error => {
        console.log('Interstitial hook error:', error?.message || error);
      });

      return () => {
        isActive = false;
      };
    }, [enabled]),
  );
};

export default useInterstitialAd;
