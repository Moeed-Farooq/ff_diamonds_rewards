import { Platform } from 'react-native';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const canClaimDailyReward = lastClaimAt => {
  if (!lastClaimAt) {
    return true;
  }

  const lastTime = lastClaimAt.toDate().getTime();

  return Date.now() - lastTime >= DAY_IN_MILLISECONDS;
};
export const getRemainingTime = lastClaimAt => {
  if (!lastClaimAt) {
    return '00:00:00';
  }

  const lastTime = lastClaimAt.toDate().getTime();
  const nextTime = lastTime + DAY_IN_MILLISECONDS;

  const difference = nextTime - Date.now();

  if (difference <= 0) {
    return '00:00:00';
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));

  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(seconds).padStart(2, '0')}`;
};

export const getRewardDay = currentDay => {
  if (currentDay >= 7) {
    return 0;
  }

  return currentDay;
};

export const formatTime = seconds => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const generateUniqueId = () => Date.now().toString();

export const isIOS = () => Platform.OS === 'ios';

export const getDailyRewardRemainingTime = lastClaimAt => {
  if (!lastClaimAt) {
    return 'Claim Now';
  }

  const claimDate = lastClaimAt?.toDate?.() || new Date(lastClaimAt);

  const nextClaimTime = claimDate.getTime() + DAY_IN_MILLISECONDS;
  const remaining = nextClaimTime - Date.now();

  if (remaining <= 0) {
    return 'Claim Now';
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(seconds).padStart(2, '0')}`;
};

const getTimestamp = value => {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate().getTime();
  }

  return new Date(value).getTime();
};

export const canPlayScratch = lastCompletedAt => {
  if (!lastCompletedAt) {
    return true;
  }

  return Date.now() - getTimestamp(lastCompletedAt) >= DAY_IN_MILLISECONDS;
};

export const getScratchRemainingTime = lastCompletedAt => {
  if (!lastCompletedAt) {
    return '00:00:00';
  }

  const endTime = getTimestamp(lastCompletedAt) + DAY_IN_MILLISECONDS;
  const remaining = Math.max(0, endTime - Date.now());

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
};

export const getSpinRemainingTime = lastResetAt => {
  if (!lastResetAt) {
    return '00:00:00';
  }

  const endTime = getTimestamp(lastResetAt) + DAY_IN_MILLISECONDS;
  const remaining = Math.max(0, endTime - Date.now());

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
};

export const canSpinWheel = lastResetAt => {
  if (!lastResetAt) {
    return false;
  }

  const last =
    typeof lastResetAt?.toDate === 'function'
      ? lastResetAt.toDate()
      : new Date(lastResetAt);

  return Date.now() - last.getTime() >= DAY_IN_MILLISECONDS;
};

export const getRemainingSpins = spinsUsed => {
  return Math.max(5 - (spinsUsed || 0), 0);
};

export const isGuestProfile = profile => {
  if (!profile) {
    return false;
  }

  if (profile.isGuest === true) {
    return true;
  }

  if (profile.isGuest === false) {
    return false;
  }

  return profile.username === 'Guest';
};
