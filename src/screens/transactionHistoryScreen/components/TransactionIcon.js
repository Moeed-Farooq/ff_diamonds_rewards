import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SvgIcon from '../../../common/SvgIcon';
import { SVG } from '../../../assets';
import { palette, radius } from '../../../constants/theme';
import { hp, wp } from '../../../enums/StyleGuide';

const ICON_MAP = {
  daily: {
    backgroundColor: palette.transactionDailyBg,
    content: <SvgIcon icon={SVG.calender} height={hp(3.1)} width={hp(3.1)} />,
  },
  scratch: {
    backgroundColor: palette.transactionScratchBg,
    content: <SvgIcon icon={SVG.scratch} height={hp(3.1)} width={hp(3.1)} />,
  },
  spin: {
    backgroundColor: palette.transactionSpinBg,
    content: <SvgIcon icon={SVG.wheelWhite} height={hp(3.1)} width={hp(3.1)} />,
  },
  watch: {
    backgroundColor: palette.transactionWatchBg,
    content: <SvgIcon icon={SVG.play} height={hp(3.1)} width={hp(3.1)} />,
  },
  quiz: {
    backgroundColor: palette.transactionQuizBg,
    content: (
      <MaterialCommunityIcons
        name="help-circle-outline"
        size={hp(3)}
        color={palette.transactionQuizIcon}
      />
    ),
  },
  referral: {
    backgroundColor: palette.transactionReferralBg,
    content: (
      <MaterialCommunityIcons
        name="account-group-outline"
        size={hp(3)}
        color={palette.transactionReferralIcon}
      />
    ),
  },
  gift: {
    backgroundColor: palette.transactionGiftBg,
    content: (
      <MaterialCommunityIcons
        name="gift-outline"
        size={hp(3)}
        color={palette.transactionGiftIcon}
      />
    ),
  },
  mini_game: {
    backgroundColor: palette.transactionMiniGameBg,
    content: (
      <MaterialCommunityIcons
        name="controller-classic-outline"
        size={hp(3)}
        color={palette.transactionMiniGameIcon}
      />
    ),
  },
  bonus: {
    backgroundColor: palette.transactionBonusBg,
    content: <SvgIcon icon={SVG.coins} height={hp(3)} width={hp(3)} />,
  },
  redeem: {
    backgroundColor: palette.transactionGiftBg,
    content: (
      <MaterialCommunityIcons
        name="gift-outline"
        size={hp(3)}
        color={palette.transactionGiftIcon}
      />
    ),
  },
  default: {
    backgroundColor: palette.transactionBonusBg,
    content: <SvgIcon icon={SVG.coins} height={hp(3)} width={hp(3)} />,
  },
};

const TransactionIcon = ({ type }) => {
  const iconConfig = ICON_MAP[type] || ICON_MAP.default;

  return (
    <View style={[styles.iconWrap, { backgroundColor: iconConfig.backgroundColor }]}>
      {iconConfig.content}
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    width: wp(12.5),
    height: wp(12.5),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(TransactionIcon);
