import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { IMAGES } from '../../assets/images';
import { AppHeader, RewardStatusModal } from '../../components';
import BannerAdView from '../../components/BannerAdView';
import { useCoinsData, usePerkox } from '../../hooks';

const formatPoints = value => Number(value || 0).toLocaleString();

const PerkoxRewardScreen = ({ navigation }) => {
  const { coins } = useCoinsData();
  const {
    openOfferwall,
    isOpening,
    ready,
    error,
    rewardModal,
    closeRewardModal,
  } = usePerkox();

  const onOpenOfferwall = async () => {
    if (isOpening || !ready) {
      return;
    }

    const result = await openOfferwall();

    if (result.requiresAccount) {
      return;
    }

    if (!result.opened) {
      Alert.alert(en.perkox.openFailedTitle, en.perkox.openFailedMessage);
    }
  };

  const ctaDisabled = isOpening || !ready;
  const ctaLabel = isOpening
    ? en.perkox.buttonLoading
    : ready
      ? en.perkox.button
      : en.perkox.buttonPreparing;

  return (
    <AppScreen>
      <AppHeader
        title={en.perkox.screenTitle}
        subtitle={en.perkox.screenSubtitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        showCoinPill
        variant="topbar"
      />

      <View style={styles.body}>
        <View style={styles.heroCard}>
          <Image
            source={IMAGES.PERKOX_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
          <Label style={styles.heroTitle}>{en.perkox.heroTitle}</Label>
          <Label style={styles.heroMessage}>{en.perkox.heroMessage}</Label>

          <View style={styles.pointsCard}>
            <Label style={styles.pointsLabel}>{en.perkox.pointsLabel}</Label>
            <Label style={styles.pointsValue}>{formatPoints(coins)}</Label>
          </View>

          {!!error && <Label style={styles.errorText}>{error}</Label>}

          <ScalePressable
            style={[styles.ctaButton, ctaDisabled && styles.ctaButtonDisabled]}
            disabled={ctaDisabled}
            onPress={onOpenOfferwall}
          >
            {isOpening ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Label style={styles.ctaText}>{ctaLabel}</Label>
            )}
          </ScalePressable>
        </View>
      </View>

      <View style={styles.bannerWrap}>
        <BannerAdView />
      </View>

      <RewardStatusModal
        visible={rewardModal.visible}
        title={en.perkox.rewardTitle}
        message={en.perkox.rewardMessage.replace(
          '{{reward}}',
          `${formatPoints(rewardModal.amount)}`,
        )}
        buttonLabel={en.perkox.rewardButton}
        onClose={closeRewardModal}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: spacing.pageHorizontal,
  },
  heroCard: {
    marginTop: hp(2.4),
    backgroundColor: palette.card,
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: palette.blue,
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    alignItems: 'center',
    ...shadows.card,
  },
  logo: {
    width: hp(9),
    height: hp(9),
    marginBottom: hp(1.5),
    borderRadius: hp(1.6),
    overflow: 'hidden',
    backgroundColor: COLORS.black,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  heroMessage: {
    color: COLORS.white + HEX_OPACITY[72],
    fontSize: hp(1.55),
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginTop: hp(1),
    lineHeight: hp(2.2),
  },
  pointsCard: {
    width: '100%',
    marginTop: hp(2.5),
    marginBottom: hp(1),
    borderRadius: hp(1.4),
    borderWidth: 1,
    borderColor: palette.statDailyStreak + HEX_OPACITY[24],
    backgroundColor: palette.whiteTint08,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },
  pointsLabel: {
    color: COLORS.white + HEX_OPACITY[72],
    fontSize: hp(1.35),
    fontFamily: FONT.medium,
  },
  pointsValue: {
    color: palette.statDailyStreak,
    fontSize: hp(2.5),
    fontFamily: FONT.bold,
    marginTop: hp(0.4),
  },
  errorText: {
    color: palette.statDailyStreak,
    fontSize: hp(1.4),
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginBottom: hp(1.2),
  },
  ctaButton: {
    width: '100%',
    marginTop: hp(1.5),
    backgroundColor: palette.statDailyStreak,
    borderRadius: hp(1.4),
    paddingVertical: hp(1.6),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.5),
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: COLORS.black,
    fontSize: hp(1.75),
    fontFamily: FONT.semiBold,
  },
  bannerWrap: {
    paddingVertical: hp(0.6),
    backgroundColor: palette.pageBottom,
    borderTopWidth: 1,
    borderTopColor: palette.whiteTint08,
  },
});

export default PerkoxRewardScreen;
