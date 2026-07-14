import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

let mobileAdsInitPromise = null;

export const initializeMobileAds = async () => {
  if (mobileAdsInitPromise) {
    return mobileAdsInitPromise;
  }

  mobileAdsInitPromise = (async () => {
    try {
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });

      await mobileAds().initialize();
      return true;
    } catch (error) {
      console.log('MobileAds init failed:', error?.message || error);
      return false;
    }
  })();

  return mobileAdsInitPromise;
};
