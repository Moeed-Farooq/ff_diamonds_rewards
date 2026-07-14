import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { getAdMobId } from '../../config/adMobConfig';

class RewardedService {
  constructor() {
    this.rewarded = null;
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
    this.unsubscribeEvents = [];
    this.pendingShowResolver = null;
    this.rewardEarnedInCurrentShow = false;
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

    this.rewarded = RewardedAd.createForAdRequest(getAdMobId('rewardedId'), {
      requestNonPersonalizedAdsOnly: true,
    });

    const onLoaded = this.rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        this.isLoaded = true;
        this.isLoading = false;
      },
    );

    const onEarnedReward = this.rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        this.rewardEarnedInCurrentShow = true;
      },
    );

    const onClosed = this.rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      this.resolvePendingShow({
        shown: true,
        rewardEarned: this.rewardEarnedInCurrentShow,
      });

      this.rewardEarnedInCurrentShow = false;
      this.isLoaded = false;
      this.preload();
    });

    const onError = this.rewarded.addAdEventListener(AdEventType.ERROR, error => {
      this.isLoaded = false;
      this.isLoading = false;

      this.resolvePendingShow({
        shown: false,
        rewardEarned: false,
      });

      this.rewardEarnedInCurrentShow = false;
      console.log('Rewarded ad load/show error:', error?.message || error);

      setTimeout(() => {
        this.preload();
      }, 1200);
    });

    this.unsubscribeEvents = [onLoaded, onEarnedReward, onClosed, onError];
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

        if (!this.isLoading || Date.now() - startedAt > 12000) {
          resolve(false);
          return;
        }

        setTimeout(tick, 200);
      };

      tick();
    });

    try {
      this.rewarded.load();
    } catch (error) {
      this.isLoading = false;
      console.log('Rewarded preload failed:', error?.message || error);
      return false;
    }

    return this.loadPromise;
  }

  performShow() {
    this.rewardEarnedInCurrentShow = false;

    return new Promise(resolve => {
      this.pendingShowResolver = resolve;

      this.rewarded
        .show()
        .catch(error => {
          this.pendingShowResolver = null;
          this.isLoaded = false;
          console.log('Rewarded show failed:', error?.message || error);
          this.preload();

          resolve({
            shown: false,
            rewardEarned: false,
          });
        });
    });
  }

  async show() {
    const loaded = await this.preload();

    if (!loaded || !this.rewarded) {
      // Retry once with a fresh rewarded instance before giving up.
      this.isLoaded = false;
      this.isLoading = false;
      const retriedLoad = await this.preload();

      if (!retriedLoad || !this.rewarded) {
        return {
          shown: false,
          rewardEarned: false,
        };
      }

      return this.performShow();
    }

    return this.performShow();
  }
}

const rewardedService = new RewardedService();

export default rewardedService;
