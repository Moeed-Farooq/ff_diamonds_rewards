import { SVG } from '../assets';
import { SCREEN } from '../enums';
import { en } from '../languages';



export const bottomIcons = {
  [SCREEN.HOME_SCREEN]: {
    iconName: SVG.Home,
    activeIcon: SVG.HomeActive,
    title: en.tabs.home,
  },
  [SCREEN.WITHDRAWAL_SCREEN]: {
    iconName: SVG.withdraw,
    activeIcon: SVG.withdrawActive,
    title: en.tabs.withdrawal,
  },
  [SCREEN.PROFILE_SCREEN]: {
    iconName: SVG.profile,
    activeIcon: SVG.profileActive,
    title: en.tabs.profile,
  },
};

export const stats = [
  {
    icon: SVG.coins,
    color: '#DAE36A',
    label: en.profile.totalEarned,
  },
  { icon: SVG.fire, color: '#FEAA2F', label: en.profile.dailyStreak},
  {
    icon: SVG.document,
    color: '#3DA2FF',
    label: en.profile.transactions,
  },
];

export const dashboardCards = [
  {
    id: 'daily',
    title: en.rewardData.dashboardDailyTitle,
    subtitle: en.rewardData.dashboardDailySubtitle,
    icon: SVG.calender,
    status: en.rewardData.statusAvailable,
    colors: ['#FF6A3C', '#D8653A'],
    route: SCREEN.DAILY_LOGIN_SCREEN,
  },
  {
    id: 'scratch',
    title: en.rewardData.dashboardScratchTitle,
    subtitle: en.rewardData.dashboardScratchSubtitle,
    icon: SVG.scratch,
    status: en.rewardData.status6Left,
    colors: ['#B75DE5', '#931DBD'],
    route: SCREEN.SCRATCH_WIN_SCREEN,
  },
  {
    id: 'spin',
    title: en.rewardData.dashboardSpinTitle,
    subtitle: en.rewardData.dashboardSpinSubtitle,
    icon: SVG.wheelWhite,
    status: en.rewardData.status5Left,
    colors: ['#3AA9F8', '#2D7DD7'],
    route: SCREEN.SPIN_WIN_SCREEN,
  },
  {
    id: 'watch',
    title: en.rewardData.dashboardWatchTitle,
    subtitle: en.rewardData.dashboardWatchSubtitle,
    icon: SVG.play,
    status: en.rewardData.statusAvailable,
    colors: ['#57C25D', '#3A9B4A'],
    route: SCREEN.WATCH_EARN_SCREEN,
  },
];

export const todayProgressRows = [
  {
    id: 'daily',
    label: en.rewardData.todayDailyBonus,
    value: en.rewardData.statusAvailable,
  },
  {
    id: 'scratch',
    label: en.rewardData.todayScratchCards,
    value: en.rewardData.today6Remaining,
  },
  {
    id: 'spin',
    label: en.rewardData.todaySpins,
    value: en.rewardData.today5Remaining,
  },
];

export const weeklyRewards = [5, 12, 28, 45, 72, 85, 100];

export const scratchRewards = [2, 4, 6, 8, 10, 12];

export const wheelRewards = [1, 5, 10, 20, 30];

export const redemptionItems = [
  {
    id: '1',
    title: en.rewardData.diamonds100,
    subtitle: en.rewardData.basicRewardPackage,
    progress: 0,
    goal: 2000,
  },
  {
    id: '2',
    title: en.rewardData.diamonds310,
    subtitle: en.rewardData.popularChoice,
    progress: 0,
    goal: 3500,
  },
  {
    id: '3',
    title: en.rewardData.diamonds520,
    subtitle: en.rewardData.greatValuePack,
    progress: 0,
    goal: 5000,
  },
  {
    id: '4',
    title: en.rewardData.diamonds1000,
    subtitle: en.rewardData.premiumPackage,
    progress: 0,
    goal: 8000,
  },
  {
    id: '5',
    title: en.rewardData.diamonds2200,
    subtitle: en.rewardData.ultimateReward,
    progress: 0,
    goal: 10000,
  },
  {
    id: '6',
    title: en.rewardData.diamonds5600,
    subtitle: en.rewardData.legendaryPackage,
    progress: 0,
    goal: 15000,
  },
];

export const profileActions = [
  {
    id: 'history',
    title: en.rewardData.transactionHistory,
    subtitle: en.rewardData.viewCoinTransactionHistory,
    icon: 'history',
    color: '#2D9CF0',
  },
  {
    id: 'privacy',
    title: en.rewardData.privacyPolicy,
    subtitle: en.rewardData.readPrivacyPolicy,
    icon: 'shield-check',
    color: '#4FCA6C',
  },
  {
    id: 'removeAds',
    title: en.rewardData.removeAds,
    subtitle: en.rewardData.removeAdsSubtitle,
    icon: 'block-helper',
    color: '#FF5B4A',
    chip: en.rewardData.removeAdsPrice,
  },
  {
    id: 'contact',
    title: en.rewardData.contactUs,
    subtitle: en.rewardData.contactUsSubtitle,
    icon: 'email-outline',
    color: '#F0A332',
  },
  {
    id: 'share',
    title: en.rewardData.shareApp,
    subtitle: en.rewardData.shareAppSubtitle,
    icon: 'share-variant-outline',
    color: '#9A42C9',
  },
];
