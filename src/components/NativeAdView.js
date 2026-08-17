import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  NativeAd as GoogleNativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { getAdMobId } from '../config/adMobConfig';
import { palette, radius, shadows } from '../constants/theme';
import { COLORS, FONT, hp, wp } from '../enums/StyleGuide';
import { en } from '../languages';

const DEFAULT_REQUEST_OPTIONS = { requestNonPersonalizedAdsOnly: true };
const MIN_MEDIA_DIMENSION = 120;
const MEDIA_HEIGHT = Math.max(hp(20), MIN_MEDIA_DIMENSION + 20);

const AppNativeAd = ({ style, requestOptions = DEFAULT_REQUEST_OPTIONS }) => {
  const [nativeAd, setNativeAd] = useState(null);
  const [adViewHeight, setAdViewHeight] = useState(null);
  const hasMeasuredRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let loadedAd = null;

    const unitId = getAdMobId('nativeId');
    if (!unitId) {
      return undefined;
    }

    hasMeasuredRef.current = false;
    setAdViewHeight(null);

    GoogleNativeAd.createForAdRequest(unitId, requestOptions)
      .then(ad => {
        if (!mounted) {
          ad.destroy();
          return;
        }

        loadedAd = ad;
        setNativeAd(ad);
      })
      .catch(error => {
        console.warn('Native ad failed to load:', error?.message || error);
        if (mounted) {
          setNativeAd(null);
        }
      });

    return () => {
      mounted = false;
      loadedAd?.destroy();
    };
  }, [requestOptions]);

  const handleAdViewLayout = useCallback(event => {
    if (hasMeasuredRef.current) {
      return;
    }

    const measuredHeight = event?.nativeEvent?.layout?.height;
    if (!measuredHeight) {
      return;
    }

    hasMeasuredRef.current = true;
    setAdViewHeight(Math.ceil(measuredHeight));
  }, []);

  if (!nativeAd) {
    return null;
  }

  const hasRating =
    typeof nativeAd.starRating === 'number' && nativeAd.starRating > 0;
  const hasPriceOrStore = Boolean(nativeAd.price || nativeAd.store);

  return (
    <View style={[styles.container, style]}>
      <NativeAdView
        nativeAd={nativeAd}
        style={[styles.adView, adViewHeight ? { height: adViewHeight } : null]}
        onLayout={handleAdViewLayout}
      >
        <View style={styles.content}>
          <View style={styles.attributionBadge}>
            <Text style={styles.attributionText}>
              {en.home.sponsored || 'Sponsored'}
            </Text>
          </View>

          <View style={styles.headerRow}>
            {nativeAd.icon ? (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
              </NativeAsset>
            ) : null}

            <View style={styles.headerText}>
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.headline} numberOfLines={2}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>

              {nativeAd.advertiser ? (
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text style={styles.advertiser} numberOfLines={1}>
                    {nativeAd.advertiser}
                  </Text>
                </NativeAsset>
              ) : null}
            </View>
          </View>

          <View style={styles.mediaWrap}>
            <NativeMediaView style={styles.media} resizeMode="cover" />
          </View>

          {nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={styles.body} numberOfLines={3}>
                {nativeAd.body}
              </Text>
            </NativeAsset>
          ) : null}

          {hasRating || hasPriceOrStore ? (
            <View style={styles.metaRow}>
              {hasRating ? (
                <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                  <Text style={styles.metaText}>
                    {'\u2605'} {nativeAd.starRating.toFixed(1)}
                  </Text>
                </NativeAsset>
              ) : null}

              {nativeAd.store ? (
                <NativeAsset assetType={NativeAssetType.STORE}>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {nativeAd.store}
                  </Text>
                </NativeAsset>
              ) : null}

              {nativeAd.price ? (
                <NativeAsset assetType={NativeAssetType.PRICE}>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {nativeAd.price}
                  </Text>
                </NativeAsset>
              ) : null}
            </View>
          ) : null}

          {nativeAd.callToAction ? (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaText} numberOfLines={1}>
                  {nativeAd.callToAction}
                </Text>
              </View>
            </NativeAsset>
          ) : null}
        </View>
      </NativeAdView>
    </View>
  );
};

export default AppNativeAd;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.whiteTint08,
    overflow: 'hidden',
    ...shadows.card,
  },
  adView: {
    width: '100%',
  },
  content: {
    width: '100%',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.5),
  },
  attributionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.orange,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.25),
    borderRadius: radius.sm,
    marginBottom: hp(1),
  },
  attributionText: {
    color: COLORS.white,
    fontSize: hp(1.1),
    fontFamily: FONT.bold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  icon: {
    width: hp(5.2),
    height: hp(5.2),
    borderRadius: hp(1.4),
    marginRight: wp(2.5),
    backgroundColor: palette.whiteTint11,
  },
  headerText: {
    flex: 1,
  },
  headline: {
    color: palette.textPrimary,
    fontSize: hp(1.85),
    fontFamily: FONT.bold,
  },
  advertiser: {
    color: palette.textSecondary,
    fontSize: hp(1.3),
    fontFamily: FONT.medium,
    marginTop: hp(0.25),
  },
  mediaWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.cardDeep,
  },
  media: {
    width: '100%',
    height: MEDIA_HEIGHT,
    minWidth: 160,
    minHeight: 160,
    alignSelf: 'center',
  },
  body: {
    color: palette.textSecondary,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
    marginTop: hp(1),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp(3),
    marginTop: hp(1),
  },
  metaText: {
    color: palette.orange,
    fontSize: hp(1.3),
    fontFamily: FONT.bold,
  },
  ctaButton: {
    marginTop: hp(1.3),
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.orange,
    paddingVertical: hp(1),
    borderRadius: radius.md,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: FONT.bold,
    letterSpacing: 0.3,
  },
});
