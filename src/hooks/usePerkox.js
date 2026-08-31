import { useCallback, useEffect, useState } from 'react';
import {
  initPerkoxSdk,
  onPerkoxRewardCredited,
  readPerkoxAmount,
  showPerkoxOfferwall,
} from '../services/perkox';
import { useUserProfile } from './useUserSession';

const usePerkox = () => {
  const { uid, isGuest, refreshProfile } = useUserProfile();
  const [isOpening, setIsOpening] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [lastReward, setLastReward] = useState(null);
  const [rewardModal, setRewardModal] = useState({
    visible: false,
    amount: 0,
    status: '',
    txid: '',
  });

  useEffect(() => {
    if (!uid || isGuest) {
      setReady(false);
      return undefined;
    }

    let isActive = true;
    setError('');

    initPerkoxSdk()
      .then(() => {
        if (isActive) {
          setReady(true);
        }
      })
      .catch(initError => {
        console.log('Perkox bootstrap failed:', initError?.message || initError);
        if (isActive) {
          setReady(false);
          setError(initError?.message || 'Unable to initialize Perkox SDK.');
        }
      });

    const unsubscribeReward = onPerkoxRewardCredited((reward, result) => {
      if (!result?.granted) {
        return;
      }

      const nextReward = {
        amount: result.granted || readPerkoxAmount(reward),
        status: String(reward?.status || ''),
        txid: String(result.txid || reward?.txid || ''),
      };

      setLastReward(nextReward);
      setRewardModal({
        visible: true,
        ...nextReward,
      });

      refreshProfile().catch(() => {});
    });

    return () => {
      isActive = false;
      unsubscribeReward();
    };
  }, [uid, isGuest, refreshProfile]);

  const openOfferwall = useCallback(async () => {
    if (!uid || isGuest) {
      return {
        opened: false,
        requiresAccount: true,
      };
    }

    setIsOpening(true);
    setError('');

    try {
      const opened = await showPerkoxOfferwall();

      if (!opened) {
        setError('Failed to launch Perkox Offerwall.');
      }

      await refreshProfile().catch(() => {});

      return {
        opened: Boolean(opened),
        requiresAccount: false,
      };
    } catch (openError) {
      const message = openError?.message || 'Failed to launch Perkox Offerwall.';
      console.log('Perkox open failed:', message);
      setError(message);

      return {
        opened: false,
        requiresAccount: false,
      };
    } finally {
      setIsOpening(false);
    }
  }, [uid, isGuest, refreshProfile]);

  const closeRewardModal = useCallback(() => {
    setRewardModal(current => ({
      ...current,
      visible: false,
    }));
  }, []);

  return {
    openOfferwall,
    isOpening,
    ready,
    error,
    rewardModal,
    lastReward,
    closeRewardModal,
    requiresAccount: !uid || isGuest,
  };
};

export default usePerkox;
