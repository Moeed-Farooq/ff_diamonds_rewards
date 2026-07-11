import { Dimensions, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const ACTIVE_OPACITY = 0.75;
export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

export { wp, hp };

export const COLORS = {
  // === BACKGROUND SCREENS & CONTAINERS ===
  splashBg: '#0362c2', 
  
  // Card and Surface colors (Pure white cards for high contrast)
  cardBg: '#FFFFFF',
  surfaceSoft: '#EBF1F6',
  surfaceElevated: '#DCE5ED',

  // === CORE CONTRAST COLORS (Main Identity) ===
  primary: '#0052CC',         
  secondary: '#0A192F',       
  accent: '#FF6B00',      
  accentAlt: '#00B4D8',      

  // === COMPONENT SPECIFIC CONTRAST (Buttons, Cards, Tabs) ===
  btnBgPrimary: '#0052CC',   
  btnTextPrimary: '#FFFFFF',  
  btnBgAccent: '#FF6B00',   
  btnTextAccent: '#FFFFFF',   
  btnBgSuccess: '#10B981',    
  btnTextSuccess: '#FFFFFF',
  
  // Border & Dividers
  borderSoft: '#E2E8F0',
  borderContrast: '#0052CC',
  shadowColor: '#0A192F',     

  // === BASIC UTILITY COLORS (Refined and Crisp) ===
  white: '#FFFFFF',
  black: '#070F1E',           
  orange: '#e73600',           
  
  // Status Colors (High Visibility)
  red: '#FF3B30',           
  lightRed: '#FFEBEA',
  
  blue: '#007AFF',           
  lightBlue: '#E5F2FF',


  grey: '#838383',
  lightGrey: '#dadada',
  
  green: '#10B981',          
  lightGreen: '#E6F4EA',
  
  yellow: '#FFCC00',        
  lightYellow: '#ffd240',

  // === TEXT COLORS (Strict Readability Hierarchy) ===
  textPrimary: '#0A192F',     
  textMuted: '#94A3B8',       
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // === GRADIENTS (For Premium Scratch Cards or Spin Wheels) ===
  gradientStart: '#0052CC',
  gradientMid: '#00B4D8',
  gradientEnd: '#FF6B00',     

  // === SPECIAL UI OVERLAYS ===
  transparent: 'transparent',
  modalOverlayDark: 'rgba(10, 25, 47, 0.8)',
  wheelGlowBg: 'rgba(0, 82, 204, 0.08)',

  
};

export const FONT = {
  bold: 'Poppins-Bold',
  regular: 'Poppins-Regular',
  extraBold: 'Poppins-ExtraBold',
  semiBold: 'Poppins-SemiBold',
  medium: 'Poppins-Medium',
};

export const TEXT_STYLE = StyleSheet.create({
  titleExtraBold: {
    fontFamily: FONT.PoppinsextraBold,
    fontSize: hp(2.6), // ~21px
  },
  titleBold: {
    fontFamily: FONT.Poppinsbold,
    fontSize: hp(2.6),
  },
  smallTitleBold: {
    fontFamily: FONT.Poppinsbold,
    fontSize: hp(2.2), // ~17px
  },
  smallTitleSemiBold: {
    fontFamily: FONT.PoppinssemiBold,
    fontSize: hp(2.4), // ~20px
  },
  smallTitleMedium: {
    fontFamily: FONT.Poppinsmedium,
    fontSize: hp(2.4),
  },
  bigText: {
    fontFamily: FONT.Poppinsregular,
    fontSize: hp(2.1), // ~17px
  },
  bigTextSemiBold: {
    fontFamily: FONT.PoppinssemiBold,
    fontSize: hp(2.0), // ~16px
  },
  bigTextMedium: {
    fontFamily: FONT.Poppinsmedium,
    fontSize: hp(2.0),
  },
  bigTextBold: {
    fontFamily: FONT.Poppinsbold,
    fontSize: hp(3.7), // ~20px
  },

  text: {
    fontFamily: FONT.Poppinsregular,
    fontSize: hp(1.7), // ~13px
  },
  textSemiBold: {
    fontFamily: FONT.PoppinssemiBold,
    fontSize: hp(1.8), // ~13.5px
  },
  textMedium: {
    fontFamily: FONT.Poppinsmedium,
    fontSize: hp(1.7),
  },
  textBold: {
    fontFamily: FONT.PoppinssemiBold,
    fontSize: hp(1.8),
  },

  smallText: {
    fontFamily: FONT.Poppinsregular,
    fontSize: hp(1.4), // ~11px
  },
  smallTextSemiBold: {
    fontFamily: FONT.PoppinssemiBold,
    fontSize: hp(1.4),
  },
  smallTextMedium: {
    fontFamily: FONT.Poppinsmedium,
    fontSize: hp(1.4),
  },
  smallTextBold: {
    fontFamily: FONT.Poppinsbold,
    fontSize: hp(1.4),
  },
});
export const TEXT_STYLE_2 = StyleSheet.create({
  titleExtraBold: {
    fontFamily: FONT.PlayfairDisplayBlack,
    fontSize: hp(2.6), // ~21px
  },
  titleBold: {
    fontFamily: FONT.PlayfairDisplayBold,
    fontSize: hp(2.6),
  },
  smallTitleBold: {
    fontFamily: FONT.PlayfairDisplayBold,
    fontSize: hp(2.2), // ~17px
  },
  smallTitleSemiBold: {
    fontFamily: FONT.PlayfairDisplayBoldItalic,
    fontSize: hp(2.4), // ~20px
  },
  smallTitleMedium: {
    fontFamily: FONT.PlayfairDisplayRegular,
    fontSize: hp(2.4),
  },
  bigText: {
    fontFamily: FONT.PlayfairDisplayRegular,
    fontSize: hp(2.1), // ~17px
  },
  bigTextSemiBold: {
    fontFamily: FONT.PlayfairDisplayBold,
    fontSize: hp(2.0), // ~16px
  },
  bigTextMedium: {
    fontFamily: FONT.PlayfairDisplayItalic,
    fontSize: hp(2.0),
  },
  bigTextBold: {
    fontFamily: FONT.PlayfairDisplayBlack,
    fontSize: hp(3.7), // ~20px
  },

  text: {
    fontFamily: FONT.PlayfairDisplayRegular,
    fontSize: hp(1.7), // ~13px
  },
  textSemiBold: {
    fontFamily: FONT.PlayfairDisplayBold,
    fontSize: hp(1.8), // ~13.5px
  },
  textMedium: {
    fontFamily: FONT.PlayfairDisplayItalic,
    fontSize: hp(1.7),
  },
  textBold: {
    fontFamily: FONT.PlayfairDisplayBold,
    fontSize: hp(1.8),
  },

  smallText: {
    fontFamily: FONT.PlayfairDisplayRegular,
    fontSize: hp(1.4), // ~11px
  },
  smallTextSemiBold: {
    fontFamily: FONT.PlayfairDisplayBold,
    fontSize: hp(1.4),
  },
  smallTextMedium: {
    fontFamily: FONT.PlayfairDisplayItalic,
    fontSize: hp(1.4),
  },
  smallTextBold: {
    fontFamily: FONT.PlayfairDisplayBlack,
    fontSize: hp(1.4),
  },
});

export const commonStyles = StyleSheet.create({
  horizontalView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  horizontalView_m05: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(0.5),
  },
  horizontalView_m1: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(1),
  },
  justifyView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  justifyView_m05: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(0.5),
  },
  justifyView_m1: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(1),
  },
  justifyView_m2: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow_6: {
    elevation: 10,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 10,
  },
  shadow_5: {
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shadow_3: {
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  shadow_2: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
  },
  noPadding: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingStart: 0,
    paddingEnd: 0,
  },
  noMargin: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginStart: 0,
    marginEnd: 0,
  },
});


export const HEX_OPACITY = {
    100: 'FF',
    99: 'FC',
    98: 'FA',
    97: 'F7',
    96: 'F5',
    95: 'F2',
    94: 'F0',
    93: 'ED',
    92: 'EB',
    91: 'E8',
    90: 'E6',
    89: 'E3',
    88: 'E0',
    87: 'DE',
    86: 'DB',
    85: 'D9',
    84: 'D6',
    83: 'D4',
    82: 'D1',
    81: 'CF',
    80: 'CC',
    79: 'C9',
    78: 'C7',
    77: 'C4',
    76: 'C2',
    75: 'BF',
    74: 'BD',
    73: 'BA',
    72: 'B8',
    71: 'B5',
    70: 'B3',
    69: 'B0',
    68: 'AD',
    67: 'AB',
    66: 'A8',
    65: 'A6',
    64: 'A3',
    63: 'A1',
    62: '9E',
    61: '9C',
    60: '99',
    59: '96',
    58: '94',
    57: '91',
    56: '8F',
    55: '8C',
    54: '8A',
    53: '87',
    52: '85',
    51: '82',
    50: '80',
    49: '7D',
    48: '7A',
    47: '78',
    46: '75',
    45: '73',
    44: '70',
    43: '6E',
    42: '6B',
    41: '69',
    40: '66',
    39: '63',
    38: '61',
    37: '5E',
    36: '5C',
    35: '59',
    34: '57',
    33: '54',
    32: '52',
    31: '4F',
    30: '4D',
    29: '4A',
    28: '47',
    27: '45',
    26: '42',
    25: '40',
    24: '3D',
    23: '3B',
    22: '38',
    21: '36',
    20: '33',
    19: '30',
    18: '2E',
    17: '2B',
    16: '29',
    15: '26',
    14: '24',
    13: '21',
    12: '1F',
    11: '1C',
    10: '1A',
    9: '17',
    8: '14',
    7: '12',
    6: '0F',
    5: '0D',
    4: '0A',
    3: '08',
    2: '05',
    1: '03',
    0: '00',
}