import { AdEventType, AppOpenAd } from 'react-native-google-mobile-ads';
import { getAdMobId } from '../../config/adMobConfig';

let appOpenAd = null;
let appOpenLoaded = false;
let appOpenLoading = false;
let listenersAttached = false;
let lastAppOpenShownAt = 0;
let appOpenLoadedAt = 0;

const MIN_APP_OPEN_INTERVAL_MS = 4 * 60 * 1000;
const MAX_APP_OPEN_AD_AGE_MS = 4 * 60 * 60 * 1000;

const appOpenCloseSubscribers = new Set();
const appOpenErrorSubscribers = new Set();

const notifySubscribers = subscribers => {
  subscribers.forEach(callback => {
    try {
      callback?.();
    } catch (error) {
      console.warn('App open subscriber callback failed:', error?.message || error);
    }
  });

  subscribers.clear();
};

const isLoadedAdExpired = () =>
  appOpenLoadedAt > 0 && Date.now() - appOpenLoadedAt > MAX_APP_OPEN_AD_AGE_MS;

const createAppOpenAd = () =>
  AppOpenAd.createForAdRequest(getAdMobId('appOpenId'), {
    requestNonPersonalizedAdsOnly: true,
  });

const ensureAppOpenInstance = () => {
  if (!appOpenAd) {
    appOpenAd = createAppOpenAd();
    listenersAttached = false;
  }

  if (!listenersAttached) {
    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      appOpenLoaded = true;
      appOpenLoading = false;
      appOpenLoadedAt = Date.now();
    });

    appOpenAd.addAdEventListener(AdEventType.ERROR, error => {
      appOpenLoaded = false;
      appOpenLoading = false;
      appOpenLoadedAt = 0;
      console.warn('App open ad error:', error?.message || error);
      notifySubscribers(appOpenErrorSubscribers);
      appOpenCloseSubscribers.clear();

      setTimeout(() => {
        preloadAppOpenAd();
      }, 15000);
    });

    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      appOpenLoaded = false;
      appOpenLoading = false;
      appOpenLoadedAt = 0;
      notifySubscribers(appOpenCloseSubscribers);
      appOpenErrorSubscribers.clear();
      preloadAppOpenAd();
    });

    listenersAttached = true;
  }

  return appOpenAd;
};

export const preloadAppOpenAd = () => {
  if (appOpenLoaded || appOpenLoading) {
    return;
  }

  const unitId = getAdMobId('appOpenId');
  if (!unitId) {
    return;
  }

  const ad = ensureAppOpenInstance();

  appOpenLoading = true;
  appOpenLoaded = false;
  appOpenLoadedAt = 0;

  try {
    ad.load();
  } catch (error) {
    appOpenLoading = false;
    appOpenLoaded = false;
    console.warn('App open ad preload failed:', error?.message || error);
  }
};

export const isAppOpenAdReady = () => appOpenLoaded && !isLoadedAdExpired();

export const showAppOpenIfAvailable = options => {
  try {
    const unitId = getAdMobId('appOpenId');
    if (!unitId) {
      return false;
    }

    const ad = ensureAppOpenInstance();
    const onClosed = options?.onClosed;
    const onError = options?.onError;
    const ignoreCooldown = Boolean(options?.ignoreCooldown);
    const now = Date.now();

    if (
      !ignoreCooldown &&
      lastAppOpenShownAt > 0 &&
      now - lastAppOpenShownAt < MIN_APP_OPEN_INTERVAL_MS
    ) {
      return false;
    }

    if (isLoadedAdExpired()) {
      appOpenLoaded = false;
      appOpenLoadedAt = 0;
      preloadAppOpenAd();
      return false;
    }

    if (!appOpenLoaded) {
      preloadAppOpenAd();
      return false;
    }

    if (typeof onClosed === 'function') {
      appOpenCloseSubscribers.add(onClosed);
    }

    if (typeof onError === 'function') {
      appOpenErrorSubscribers.add(onError);
    }

    lastAppOpenShownAt = now;
    ad.show();
    return true;
  } catch (error) {
    console.warn('App open ad show failed:', error?.message || error);
    if (typeof options?.onClosed === 'function') {
      appOpenCloseSubscribers.delete(options.onClosed);
    }
    if (typeof options?.onError === 'function') {
      appOpenErrorSubscribers.delete(options.onError);
    }
    options?.onError?.();
    preloadAppOpenAd();
    return false;
  }
};
