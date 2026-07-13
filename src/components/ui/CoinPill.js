import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { palette, radius, shadows } from '../../constants/theme';
import { FONT, hp, wp } from '../../enums/StyleGuide';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { useCoinsData } from '../../hooks';

const CoinPill = () => {
  const { coins } = useCoinsData();
  return (
    <LinearGradient
      colors={['#FF6A3C', '#E45A31']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.row}>
        <SvgIcon icon={SVG.coins} height={hp(2.6)} width={hp(2.6)} />
        <Label style={styles.amount}>{coins}</Label>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: wp(25),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.95),
    borderRadius: radius.lg,
    borderWidth: 1,
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
