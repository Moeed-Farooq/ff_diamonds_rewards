import { useEffect, useState } from 'react';
import { subscribeToCurrentUserData } from '../services/firebaseServices';

const MAX_SCRATCH = 6;
const MAX_SPINS = 5;

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
  return !isToday(dailyLogin?.lastClaimAt) ? 'Available' : '';
};

const getScratchStatus = scratchWin => {
  if (!scratchWin) {
    return `${MAX_SCRATCH} Left`;
  }

  if (scratchWin.lastCompletedAt) {
    return isToday(scratchWin.lastCompletedAt)
      ? '0 Left'
      : `${MAX_SCRATCH} Left`;
  }

  const left = Math.max(
    0,
    MAX_SCRATCH - (scratchWin.claimedCards?.length || 0),
  );

  return `${left} Left`;
};

const getSpinStatus = spinWheel => {
  if (!spinWheel) {
    return `${MAX_SPINS} Left`;
  }

  if (spinWheel.lastResetAt) {
    return isToday(spinWheel.lastResetAt)
      ? '0 Left'
      : `${MAX_SPINS} Left`;
  }

  const left = Math.max(
    0,
    MAX_SPINS - (spinWheel.spinsUsed || 0),
  );

  return `${left} Left`;
};

export const useDashboardStatus = () => {
  const [status, setStatus] = useState({
    daily: '',
    scratch: `${MAX_SCRATCH} Left`,
    spin: `${MAX_SPINS} Left`,
    watch: 'Available',
    blockPuzzle: 'Available',
  });

  useEffect(() => {
    const unsubscribe = subscribeToCurrentUserData(user => {
      if (!user) return;

      setStatus({
        daily: getDailyStatus(user.dailyLogin),
        scratch: getScratchStatus(user.scratchWin),
        spin: getSpinStatus(user.spinWheel),
        watch: 'Available',
        blockPuzzle: 'Available',
      });
    });

    return unsubscribe;
  }, []);

  return status;
};

export default useDashboardStatus;