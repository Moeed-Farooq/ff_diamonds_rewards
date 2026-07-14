import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getAdMobId } from '../config/adMobConfig';
import { wp } from '../enums/StyleGuide';

const BannerAdView = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={getAdMobId('bannerId')}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={error => {
          console.log('Banner ad failed to load:', error?.message || error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
  },
});

export default BannerAdView;
