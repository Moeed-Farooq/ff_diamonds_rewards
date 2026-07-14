import React from 'react';
import { StyleSheet, View } from 'react-native';
import Label from '../../../common/Label';
import SvgIcon from '../../../common/SvgIcon';
import { SVG } from '../../../assets';
import { palette } from '../../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../../enums/StyleGuide';
import { en } from '../../../languages';

const EmptyState = () => {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.iconWrap}>
        <SvgIcon icon={SVG.document} height={hp(7.2)} width={hp(7.2)} />
      </View>
      <Label style={styles.emptyTitle}>{en.transactionHistory.emptyTitle}</Label>
      <Label style={styles.emptySubtitle}>{en.transactionHistory.emptySubtitle}</Label>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(10),
    paddingBottom: hp(10),
  },
  iconWrap: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    backgroundColor: palette.whiteTint08,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  emptyTitle: {
    color: COLORS.white,
    fontSize: hp(3.1),
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: hp(0.8),
    color: COLORS.white + HEX_OPACITY[62],
    fontSize: hp(2),
    lineHeight: hp(3),
    textAlign: 'center',
    fontFamily: FONT.medium,
  },
});

export default React.memo(EmptyState);
