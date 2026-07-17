import {
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import { getAdMobId } from '../../config/adMobConfig';

class InterstitialService {
  constructor() {
    this.interstitial = null;
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
    this.unsubscribeEvents = [];
    this.pendingShowResolver = null;
  }

  initialize() {
    this.preload();
  }

  cleanupListeners() {
    this.unsubscribeEvents.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.unsubscribeEvents = [];
  }

  resolvePendingShow(payload) {
    if (!this.pendingShowResolver) {
      return;
    }

    this.pendingShowResolver(payload);
    this.pendingShowResolver = null;
  }

  createAd() {
    this.cleanupListeners();

    this.interstitial = InterstitialAd.createForAdRequest(
      getAdMobId('interstitialId'),
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );

    const onLoaded = this.interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        this.isLoaded = true;
        this.isLoading = false;
      },
    );

    const onClosed = this.interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        this.resolvePendingShow({ shown: true });
        this.isLoaded = false;
        this.preload();
      },
    );

    const onError = this.interstitial.addAdEventListener(
      AdEventType.ERROR,
      error => {
        this.isLoaded = false;
        this.isLoading = false;
        this.resolvePendingShow({ shown: false });
        console.log('Interstitial load/show error:', error?.message || error);

        setTimeout(() => {
          this.preload();
        }, 1200);
      },
    );

    this.unsubscribeEvents = [onLoaded, onClosed, onError];
  }

  async preload() {
    if (this.isLoaded) {
      return true;
    }

    if (this.isLoading) {
      return this.loadPromise || false;
    }

    this.isLoading = true;
    this.createAd();

    this.loadPromise = new Promise(resolve => {
      const startedAt = Date.now();
      const tick = () => {
        if (this.isLoaded) {
          resolve(true);
          return;
        }

        if (!this.isLoading || Date.now() - startedAt > 10000) {
          resolve(false);
          return;
        }

        setTimeout(tick, 200);
      };

      tick();
    });

    try {
      this.interstitial.load();
    } catch (error) {
      this.isLoading = false;
      console.log('Interstitial preload failed:', error?.message || error);
      return false;
    }

    return this.loadPromise;
  }

  performShow() {
    return new Promise(resolve => {
      this.pendingShowResolver = resolve;

      this.interstitial.show().catch(error => {
        this.pendingShowResolver = null;
        this.isLoaded = false;
        console.log('Interstitial show failed:', error?.message || error);
        this.preload();
        resolve({ shown: false });
      });
    });
  }

  async show() {
    const loaded = await this.preload();

    if (!loaded || !this.interstitial) {
      this.isLoaded = false;
      this.isLoading = false;
      const retriedLoad = await this.preload();

      if (!retriedLoad || !this.interstitial) {
        return { shown: false };
      }
    }

    return this.performShow();
  }

  async showIfReady() {
    if (!this.interstitial || !this.isLoaded) {
      this.preload();
      return false;
    }

    const result = await this.performShow();
    return result.shown;
  }
}

const interstitialService = new InterstitialService();

export default interstitialService;
