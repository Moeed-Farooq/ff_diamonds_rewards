import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Label from '../../../common/Label';
import SvgIcon from '../../../common/SvgIcon';
import { SVG } from '../../../assets';
import TransactionIcon from './TransactionIcon';
import { palette, radius, shadows } from '../../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../../enums/StyleGuide';
import { en } from '../../../languages';

const formatDateAndTime = value => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      dateText: '--/--/----',
      timeText: '--:--',
    };
  }

  const dateText = date.toLocaleDateString('en-GB');
  const timeText = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    dateText,
    timeText,
  };
};

const TransactionCard = ({ item }) => {
  const { dateText, timeText } = useMemo(
    () => formatDateAndTime(item?.createdAt),
    [item?.createdAt],
  );

  return (
    <View style={styles.card}>
      <TransactionIcon type={item?.type} />

      <View style={styles.contentWrap}>
        <Label style={styles.title}>{item?.displayTitle}</Label>
        <Label style={styles.dateTime}>{`${dateText} ${timeText}`}</Label>
      </View>

      <View style={styles.amountWrap}>
        <Label style={styles.amountText}>{item?.amountText}</Label>
        <View style={styles.coinRow}>
          <SvgIcon icon={SVG.coins} height={hp(2.3)} width={hp(2.3)} />
          <Label style={styles.coinLabel}>{en.app.coins}</Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4.4),
    height: hp(15),
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.card,
  },
  contentWrap: {
    marginLeft: wp(4.2),
    flex: 1,
    paddingRight: wp(2),
  },
  title: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
    lineHeight: hp(3)
  },
  dateTime: {
    marginTop: hp(2),
    color: COLORS.white + HEX_OPACITY[60],
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
  },
  amountWrap: {
    alignItems: 'flex-end',
    minWidth: wp(16),
  },
  amountText: {
    color: palette.activeGreen,
    fontSize: hp(3),
    fontFamily: FONT.bold,
  },
  coinRow: {
    marginTop: hp(0.25),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.2),
  },
  coinLabel: {
    color: COLORS.white + HEX_OPACITY[72],
    fontSize: hp(1.7),
    fontFamily: FONT.medium,
  },
});

export default React.memo(TransactionCard);
