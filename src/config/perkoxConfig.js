import { Platform } from 'react-native';

const PERKOX_IDS = {
  android: {
    appId: 'app_bdujmesgNOADOlT7AVJiBHSAG2ge712j',
    sdkKey: 'sdk_eAx5kDxPNY33NbpehobcVePwNxqqx5Bz',
    apiKey: 'api_7sMkDXE7azSy0RaYnHVTTeVUEujDEceY',
  },
  ios: {
    appId: 'app_QNMc1inoelSTfRs8I9OBRazAlUi4gO4X',
    sdkKey: 'sdk_4fSPbbBHaOaKLWwnJsU4usRCZqPe8eQo',
    apiKey: 'api_Zzk2ynZ6CfY3SLiO0wlLPaf0cGs9EIhz',
  },
};

const platformKey = Platform.OS === 'ios' ? 'ios' : 'android';
const platformIds = PERKOX_IDS[platformKey];

export const PERKOX_CONFIG = {
  APP_ID: platformIds.appId,
  /** Maps to native SDK `sdkKey`. */
  SDK_ID: platformIds.sdkKey,
  API_KEY: platformIds.apiKey,
  BETA: false,
  OFFERS_URL: 'https://api.perkox.com/offerwall/api/offers',
  WEB_OFFERWALL_URL: 'https://perkwall.com',
};

export const perkoxConfig = {
  appId: PERKOX_CONFIG.APP_ID,
  sdkKey: PERKOX_CONFIG.SDK_ID,
  apiKey: PERKOX_CONFIG.API_KEY,
  beta: PERKOX_CONFIG.BETA,
};
