import { Platform } from 'react-native';

export const useTestAds = true; 

const TEST_ADMOB_IDS = {
  android: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    bannerId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  },
  ios: {
    appId: 'ca-app-pub-3940256099942544~1458002511',
    bannerId: 'ca-app-pub-3940256099942544/2934735716',
    interstitialId: 'ca-app-pub-3940256099942544/4411468910',
    rewardedId: 'ca-app-pub-3940256099942544/1712485313',
  },
};

const PRODUCTION_ADMOB_IDS = {
  android: {
    appId: 'ca-app-pub-6091683149476586~6187521438',
    bannerId: 'ca-app-pub-6091683149476586/6562925959',
    interstitialId: 'ca-app-pub-6091683149476586/1885314345',
    rewardedId: 'ca-app-pub-6091683149476586/7697446591',
  },
  ios: {
    appId: '',
    bannerId: '',
    interstitialId: '',
    rewardedId: '',
  },
};

const ACTIVE_IDS = useTestAds ? TEST_ADMOB_IDS : PRODUCTION_ADMOB_IDS;
const platformKey = Platform.OS === 'ios' ? 'ios' : 'android';

export const adMobConfig = {
  useTestAds,
  ...ACTIVE_IDS[platformKey],
};

export const getAdMobId = key => adMobConfig[key] || '';