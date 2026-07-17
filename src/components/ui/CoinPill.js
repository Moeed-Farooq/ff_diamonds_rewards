import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Label from '../../common/Label';
import { palette, radius, shadows } from '../../constants/theme';
import { FONT, hp, wp } from '../../enums/StyleGuide';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { useCoinsData } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import { SCREEN } from '../../enums';

const CoinPill = () => {
  const { coins } = useCoinsData();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.row}
        onPress={() => navigation.navigate(SCREEN.TRANSACTION_HISTORY_SCREEN)}
      >
        <SvgIcon icon={SVG.coins} height={hp(2.6)} width={hp(2.6)} />
        <Label style={styles.amount}>{coins}</Label>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: wp(25),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.95),
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: palette.orange,
    ...shadows.glow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
  },
  amount: {
    color: palette.textPrimary,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
  },
});

export default CoinPill;
