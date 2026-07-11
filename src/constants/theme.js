import { hp, wp } from '../enums/StyleGuide';

export const palette = {
  pageTop: '#171A3C',
  pageBottom: '#13427D',
  card: '#162858',
  cardSoft: '#1D2C5A',
  textPrimary: '#F4F8FF',
  textSecondary: '#A8B2CC',
  orange: '#FF6E3D',
  purple: '#A132D7',
  blue: '#3094EB',
  green: '#4CB958',
  activeGreen: '#52CA62',
  tabBar: '#181A3A',
  border: 'rgba(255,255,255,0.1)',
  line: 'rgba(214,225,255,0.25)',
  overlay: 'rgba(12,18,39,0.72)',
};

export const shadows = {
  card: {
    shadowColor: '#040913',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FF6E3D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 7,
  },
};

export const radius = {
  xl: wp(7),
  lg: wp(5),
  md: wp(4),
  sm: wp(3),
  pill: 999,
};

export const spacing = {
  pageHorizontal: wp(5.3),
  sectionGap: hp(2.4),
};
