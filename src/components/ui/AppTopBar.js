import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Label from '../../common/Label';
import CoinPill from './CoinPill';
import { palette, spacing } from '../../constants/theme';
import { FONT, hp, wp } from '../../enums/StyleGuide';

const AppTopBar = ({ title, onBack, coins = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftWrap}>
        {onBack ? (
          <MaterialIcons
            name="arrow-back-ios-new"
            size={hp(2.4)}
            color={palette.orange}
            onPress={onBack}
          />
        ) : null}
        <Label style={styles.title}>{title}</Label>
      </View>
      <CoinPill coins={coins} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(0.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:hp(2)
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
    flexShrink: 1,
  },
  title: {
    color: palette.textPrimary,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
  },
});

export default AppTopBar;
