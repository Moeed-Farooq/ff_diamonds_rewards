import { useEffect, useState } from 'react';
import { en } from '../languages';
import { subscribeToCurrentUserData } from '../services/firebaseServices';
import { canSpinWheel, getRemainingSpins, canPlayScratch } from '../helpers';

const MAX_SCRATCH = 6;
const MAX_SPINS = 5;

const formatRemainingStatus = count =>
  en.rewardData.statusRemaining.replace('{{count}}', `${count}`);

const isToday = timestamp => {
  if (!timestamp) return false;

  const date =
    typeof timestamp?.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);

  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const getDailyStatus = dailyLogin => {
  return !isToday(dailyLogin?.lastClaimAt) ? en.rewardData.statusAvailable : '';
};

const getScratchStatus = scratchWin => {
  if (!scratchWin) {
    return formatRemainingStatus(MAX_SCRATCH);
  }

  if (scratchWin.lastCompletedAt && canPlayScratch(scratchWin.lastCompletedAt)) {
    return formatRemainingStatus(MAX_SCRATCH);
  }

  if (scratchWin.lastCompletedAt && !canPlayScratch(scratchWin.lastCompletedAt)) {
    const extras = Math.max(0, Number(scratchWin.extraScratches) || 0);
    return formatRemainingStatus(extras);
  }

  const left = Math.max(
    0,
    MAX_SCRATCH - (scratchWin.claimedCards?.length || 0),
  );

  return formatRemainingStatus(left);
};

const getSpinStatus = spinWheel => {
  if (!spinWheel) {
    return formatRemainingStatus(MAX_SPINS);
  }

  if (spinWheel.lastResetAt && canSpinWheel(spinWheel.lastResetAt)) {
    return formatRemainingStatus(MAX_SPINS);
  }

  const dailyLeft = getRemainingSpins(spinWheel.spinsUsed || 0);
  const extraSpins = Math.max(0, Number(spinWheel.extraSpins) || 0);
  const left = dailyLeft + extraSpins;

  return formatRemainingStatus(left);
};

export const useDashboardStatus = () => {
  const [status, setStatus] = useState({
    daily: '',
    scratch: formatRemainingStatus(MAX_SCRATCH),
    spin: formatRemainingStatus(MAX_SPINS),
    watch: en.rewardData.statusAvailable,
    blockPuzzle: en.rewardData.statusAvailable,
  });

  useEffect(() => {
    const unsubscribe = subscribeToCurrentUserData(user => {
      if (!user) return;

      setStatus({
        daily: getDailyStatus(user.dailyLogin),
        scratch: getScratchStatus(user.scratchWin),
        spin: getSpinStatus(user.spinWheel),
        watch: en.rewardData.statusAvailable,
        blockPuzzle: en.rewardData.statusAvailable,
      });
    });

    return unsubscribe;
  }, []);

  return status;
};

export default useDashboardStatus;