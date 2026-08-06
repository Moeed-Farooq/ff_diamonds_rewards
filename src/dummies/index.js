import { SVG } from '../assets';
import { gradients, palette } from '../constants/theme';
import { SCREEN } from '../enums';
import { COLORS } from '../enums/StyleGuide';
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
    color: palette.statTotalEarned,
    label: en.profile.totalEarned,
  },
  {
    icon: SVG.fire,
    color: palette.statDailyStreak,
    label: en.profile.dailyStreak,
  },
  {
    icon: SVG.document,
    color: palette.statTransactions,
    label: en.profile.transactions,
  },
];

export const dashboardCards = [
  {
    id: 'daily',
    title: en.rewardData.dashboardDailyTitle,
    subtitle: en.rewardData.dashboardDailySubtitle,
    icon: SVG.calender,
    colors: gradients.dashboardDaily,
    route: SCREEN.DAILY_LOGIN_SCREEN,
  },
  {
    id: 'scratch',
    title: en.rewardData.dashboardScratchTitle,
    subtitle: en.rewardData.dashboardScratchSubtitle,
    icon: SVG.scratch,
    colors: gradients.dashboardScratch,
    route: SCREEN.SCRATCH_WIN_SCREEN,
  },
  {
    id: 'spin',
    title: en.rewardData.dashboardSpinTitle,
    subtitle: en.rewardData.dashboardSpinSubtitle,
    icon: SVG.wheelWhite,
    colors: gradients.dashboardSpin,
    route: SCREEN.SPIN_WIN_SCREEN,
  },
  {
    id: 'watch',
    title: en.rewardData.dashboardWatchTitle,
    subtitle: en.rewardData.dashboardWatchSubtitle,
    icon: SVG.play,
    colors: gradients.dashboardWatch,
    route: SCREEN.WATCH_EARN_SCREEN,
  },
  {
    id: 'blockPuzzle',
    title: en.rewardData.dashboardBlockPuzzleTitle,
    subtitle: en.rewardData.dashboardBlockPuzzleSubtitle,
    icon: SVG.play,
    colors: gradients.dashboardBlockPuzzle,
    route: SCREEN.BLOCK_PUZZLE_SCREEN,
  },
];

export const todayProgressRows = [
  {
    id: 'daily',
    label: en.rewardData.todayDailyBonus,
  },
  {
    id: 'scratch',
    label: en.rewardData.todayScratchCards,
  },
  {
    id: 'spin',
    label: en.rewardData.todaySpins,
  },
];

export const weeklyRewards = [5, 12, 28, 45, 72, 85, 100];

export const scratchRewards = [2, 4, 6, 8, 10, 12];

export const wheelRewards = [1, 5, 10, 20, 30];

export const wheelSegmentColors = [
  COLORS.red,
  palette.blue,
  palette.wheelSegmentGreen,
  palette.wheelSegmentOrange,
  palette.wheelSegmentPurple,
];

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
    color: palette.profileActionHistory,
  },
  {
    id: 'privacy',
    title: en.rewardData.privacyPolicy,
    subtitle: en.rewardData.readPrivacyPolicy,
    icon: 'shield-check',
    color: palette.profileActionPrivacy,
  },
  // {
  //   id: 'removeAds',
  //   title: en.rewardData.removeAds,
  //   subtitle: en.rewardData.removeAdsSubtitle,
  //   icon: 'block-helper',
  //   color: palette.profileActionRemoveAds,
  //   chip: en.rewardData.removeAdsPrice,
  // },
  {
    id: 'contact',
    title: en.rewardData.contactUs,
    subtitle: en.rewardData.contactUsSubtitle,
    icon: 'email-outline',
    color: palette.profileActionContact,
  },
  {
    id: 'share',
    title: en.rewardData.shareApp,
    subtitle: en.rewardData.shareAppSubtitle,
    icon: 'share-variant-outline',
    color: palette.profileActionShare,
  },
  {
    id: 'logout',
    title: en.rewardData.logout,
    subtitle: en.rewardData.logoutSubtitle,
    icon: 'logout',
    color: palette.profileActionLogout,
  },
];

export const BLOCK_SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 0],
  ],
  [
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
];

export const SHAPE_COLORS = [
  palette.shapeColorOne,
  palette.shapeColorTwo,
  palette.shapeColorThree,
  palette.shapeColorFour,
  palette.shapeColorFive,
];
