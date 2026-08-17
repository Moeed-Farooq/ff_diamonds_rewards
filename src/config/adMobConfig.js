import { Platform } from 'react-native';

export const useTestAds = false;

const TEST_ADMOB_IDS = {
  android: {
    appId: 'ca-app-pub-3940256099942544~3347511713',
    bannerId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedId: 'ca-app-pub-3940256099942544/5224354917',
    appOpenId: 'ca-app-pub-3940256099942544/9257395921',
    nativeId: 'ca-app-pub-3940256099942544/2247696110',
  },
  ios: {
    appId: 'ca-app-pub-3940256099942544~1458002511',
    bannerId: 'ca-app-pub-3940256099942544/2934735716',
    interstitialId: 'ca-app-pub-3940256099942544/4411468910',
    rewardedId: 'ca-app-pub-3940256099942544/1712485313',
    appOpenId: 'ca-app-pub-3940256099942544/9257395921',
    nativeId: 'ca-app-pub-3940256099942544/2247696110',
  },
};

const PRODUCTION_ADMOB_IDS = {
  android: {
    appId: 'ca-app-pub-6091683149476586~6187521438',
    bannerId: 'ca-app-pub-6091683149476586/6562925959',
    interstitialId: 'ca-app-pub-6091683149476586/1885314345',
    rewardedId: 'ca-app-pub-6091683149476586/7697446591',
    appOpenId: 'ca-app-pub-6091683149476586/1140433645',
    nativeId: 'ca-app-pub-6091683149476586/2070371935',
  },
  ios: {
    appId: 'ca-app-pub-6091683149476586~4965108525',
    bannerId: 'ca-app-pub-6091683149476586/5818045253',
    interstitialId: 'ca-app-pub-6091683149476586/2209972739',
    rewardedId: 'ca-app-pub-6091683149476586/8496893496',
    appOpenId: 'ca-app-pub-6091683149476586/4066693899',
    nativeId: 'ca-app-pub-6091683149476586/7183811829',
  },
};

const ACTIVE_IDS = useTestAds ? TEST_ADMOB_IDS : PRODUCTION_ADMOB_IDS;
const platformKey = Platform.OS === 'ios' ? 'ios' : 'android';

export const adMobConfig = {
  useTestAds,
  ...ACTIVE_IDS[platformKey],
};

export const getAdMobId = key => adMobConfig[key] || '';
