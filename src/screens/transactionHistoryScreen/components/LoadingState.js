import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { palette, radius } from '../../../constants/theme';
import { hp, wp } from '../../../enums/StyleGuide';

const PlaceholderCard = () => (
  <View style={styles.card}>
    <View style={styles.icon} />
    <View style={styles.content}>
      <View style={styles.titleLine} />
      <View style={styles.subLine} />
    </View>
    <View style={styles.amountBlock} />
  </View>
);

const LoadingState = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={palette.activeGreen} style={styles.loader} />
      <PlaceholderCard />
      <PlaceholderCard />
      <PlaceholderCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5.3),
    paddingTop: hp(1.4),
    gap: hp(1.3),
  },
  loader: {
    marginBottom: hp(0.8),
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4.4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: wp(12.5),
    height: wp(12.5),
    borderRadius: radius.md,
    backgroundColor: palette.whiteTint11,
  },
  content: {
    marginLeft: wp(4.2),
    flex: 1,
    gap: hp(0.8),
  },
  titleLine: {
    width: '78%',
    height: hp(1.9),
    borderRadius: hp(0.6),
    backgroundColor: palette.whiteTint14,
  },
  subLine: {
    width: '50%',
    height: hp(1.6),
    borderRadius: hp(0.6),
    backgroundColor: palette.whiteTint09,
  },
  amountBlock: {
    width: wp(12),
    height: hp(3.2),
    borderRadius: hp(0.8),
    backgroundColor: palette.successGlowSoft,
  },
});

export default React.memo(LoadingState);
