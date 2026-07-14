import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { wheelRewards, wheelSegmentColors } from '../../dummies';
import { gradients, palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { AppHeader, RewardStatusModal } from '../../components';
import SpinWheelGraphic from '../../components/SpinWheelGraphic';
import { useCoinsData, useInterstitialAd, useRewardedAd } from '../../hooks';
import { getRemainingSpins, canSpinWheel } from '../../helpers';
import {
  claimSpinReward,
  grantExtraSpinFromRewardedAd,
} from '../../services/firebaseServices';

const size = wp(72);
const radiusCircle = size / 2;
const center = radiusCircle;

const SpinWinScreen = ({ navigation }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const { coins, spinWheel, refreshProfile } = useCoinsData();
  const { showRewardedAd, isLoading: isRewardedLoading } = useRewardedAd();
  const currentRotation = useRef(0);
  const hasDailyResetElapsed =
    !!spinWheel.lastResetAt && canSpinWheel(spinWheel.lastResetAt);
  const effectiveSpinsUsed = hasDailyResetElapsed
    ? 0
    : spinWheel.spinsUsed || 0;
  const effectiveExtraSpins = hasDailyResetElapsed
    ? 0
    : Math.max(0, Number(spinWheel.extraSpins) || 0);
  const remainingSpins =
    getRemainingSpins(effectiveSpinsUsed) + effectiveExtraSpins;
  const shouldWatchAdForSpin = remainingSpins === 0;

  // The silent failure was caused by this screen trying to manage two ad flows
  // at the same time: the focus interstitial and the rewarded ad CTA. When the
  // user has no spins left, disable the focus interstitial so the rewarded flow
  // is the only ad action competing for presentation on this screen.
  useInterstitialAd(!shouldWatchAdForSpin);

  const [isSpinning, setSpinning] = useState(false);
  const [isGrantingExtraSpin, setIsGrantingExtraSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalTitle, setStatusModalTitle] = useState('');
  const [statusModalMessage, setStatusModalMessage] = useState('');
  const [wonReward, setWonReward] = useState(0);
  const canSpin = remainingSpins > 0;
  const isActionBusy = isSpinning || isGrantingExtraSpin || isRewardedLoading;

  const openStatusModal = (title, message) => {
    setStatusModalTitle(title);
    setStatusModalMessage(message);
    setShowStatusModal(true);
  };

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const segment = useMemo(() => 360 / wheelRewards.length, []);

  const spin = async () => {
    if (isActionBusy || !canSpin) {
      return;
    }

    const selectedIndex = Math.floor(Math.random() * wheelRewards.length);
    const desiredMod = (360 - (selectedIndex * segment + segment / 2)) % 360;
    const currentMod = ((currentRotation.current % 360) + 360) % 360;
    const delta = (desiredMod - currentMod + 360) % 360;
    const finalRotation = currentRotation.current + 2160 + delta;

    setSpinning(true);
    rotateValue.setValue(currentRotation.current / 360);

    Animated.timing(rotateValue, {
      toValue: finalRotation / 360,
      duration: 4800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      currentRotation.current = finalRotation;
      setWonReward(wheelRewards[selectedIndex]);

      try {
        await claimSpinReward(wheelRewards[selectedIndex]);
        setShowModal(true);
      } catch (error) {
        openStatusModal(
          en.spinWin.spinFailedTitle,
          error?.message || en.spinWin.spinFailedMessage,
        );
      } finally {
        setSpinning(false);
      }
    });
  };

  const grantAdBasedExtraSpin = async () => {
    if (isActionBusy || !shouldWatchAdForSpin) {
      return;
    }

    setIsGrantingExtraSpin(true);

    try {
      const adResult = await showRewardedAd();

      // Guard against malformed or empty results from the existing hook/service.
      // If the SDK does not produce a usable success payload, we must still show
      // feedback instead of silently dropping the flow.
      const didShowAd = Boolean(adResult?.shown);
      const rewardEarned = Boolean(adResult?.rewardEarned);

      if (!didShowAd) {
        openStatusModal(
          en.spinWin.adUnavailableTitle,
          en.spinWin.adUnavailableMessage,
        );
        return;
      }

      if (!rewardEarned) {
        openStatusModal(
          en.spinWin.rewardNotEarnedTitle,
          en.spinWin.rewardNotEarnedMessage,
        );
        return;
      }

      await grantExtraSpinFromRewardedAd();
      await refreshProfile();

      openStatusModal(
        en.spinWin.freeSpinAddedTitle,
        en.spinWin.freeSpinAddedMessage,
      );
    } catch (error) {
      openStatusModal(
        en.spinWin.addSpinFailedTitle,
        error?.message || en.spinWin.addSpinFailedMessage,
      );
    } finally {
      setIsGrantingExtraSpin(false);
    }
  };

  const onPrimaryButtonPress = () => {
    if (shouldWatchAdForSpin) {
      grantAdBasedExtraSpin();
      return;
    }

    spin();
  };

  return (
    <AppScreen>
      <AppHeader
        title={en.spinWin.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        showCoinPill
        variant="topbar"
        coins={coins}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <SvgIcon icon={SVG.wheel} height={hp(5.6)} width={hp(5.6)} />
          <Label style={styles.summaryTitle}>{en.spinWin.screenTitle}</Label>
          <Label style={styles.summaryText}>
            {en.spinWin.remainingSpins.replace(
              '{{count}}',
              `${remainingSpins}`,
            )}
          </Label>
        </View>

        <View style={styles.wheelWrap}>
          <View style={styles.wheelAura} />
          <View style={styles.pointer}>
            <MaterialCommunityIcons
              name="chevron-down"
              size={hp(3)}
              color={palette.blue}
            />
          </View>
          <Animated.View
            style={[
              styles.wheelContainer,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <SpinWheelGraphic
              size={size}
              rewards={wheelRewards}
              segmentColors={wheelSegmentColors}
              center={center}
              radiusCircle={radiusCircle}
              textStyle={{
                fill: COLORS.white,
                fontSize: hp(2.2),
                fontFamily: FONT.bold,
              }}
            />
          </Animated.View>
        </View>

        <ScalePressable onPress={onPrimaryButtonPress} disabled={isActionBusy}>
          <LinearGradient
            colors={
              shouldWatchAdForSpin
                ? gradients.rewardedAction
                : gradients.spinAction
            }
            style={styles.spinButton}
          >
            <Label style={styles.spinButtonText}>
              {isRewardedLoading || isGrantingExtraSpin
                ? en.spinWin.buttonLoadingAd
                : shouldWatchAdForSpin
                ? en.spinWin.buttonWatchAd
                : canSpin
                ? en.spinWin.remainingSpins.replace(
                    '{{count}}',
                    `${remainingSpins}`,
                  )
                : en.spinWin.buttonNoSpins}
            </Label>
          </LinearGradient>
        </ScalePressable>
      </ScrollView>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Label style={styles.modalTitle}>{en.spinWin.modalTitle}</Label>
            <Label style={styles.modalReward}>
              {en.spinWin.modalReward.replace('{{reward}}', `${wonReward}`)}
            </Label>
            <ScalePressable
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Label style={styles.modalButtonText}>
                {en.spinWin.modalButton}
              </Label>
            </ScalePressable>
          </View>
        </View>
      </Modal>

      <RewardStatusModal
        visible={showStatusModal}
        title={statusModalTitle}
        message={statusModalMessage}
        buttonLabel={en.watchEarn.modalButton}
        onClose={() => setShowStatusModal(false)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.3),
    paddingBottom: hp(6),
  },
  summaryCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingVertical: hp(2),
    alignItems: 'center',
    ...shadows.card,
  },
  summaryTitle: {
    marginTop: hp(0.8),
    color: COLORS.white,
    fontSize: hp(3.4),
    fontFamily: FONT.bold,
  },
  summaryText: {
    marginTop: hp(0.3),
    color: COLORS.blue,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
  },
  wheelWrap: {
    marginTop: hp(4.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelAura: {
    position: 'absolute',
    width: size + wp(7),
    height: size + wp(7),
    borderRadius: (size + wp(7)) / 2,
    backgroundColor: palette.blueGlowSoft,
  },
  pointer: {
    position: 'absolute',
    zIndex: 5,
    top: hp(-0.8),
    backgroundColor: palette.spinPointerBg,
    borderRadius: radius.md,
    width: wp(8.5),
    height: hp(3.7),
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  wheelContainer: {
    borderRadius: radiusCircle,
    borderWidth: 4,
    borderColor: COLORS.white,
    overflow: 'hidden',
  },
  spinButton: {
    marginTop: hp(10),
    borderRadius: radius.pill,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    ...shadows.card,
  },
  spinButtonText: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.pageHorizontal,
  },
  modalCard: {
    width: '90%',
    borderRadius: radius.lg,
    backgroundColor: palette.pageBottom,
    alignItems: 'center',
    paddingVertical: hp(5),
    paddingHorizontal: wp(5),
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.bold,
  },
  modalReward: {
    color: COLORS.green,
    fontSize: hp(2.5),
    fontFamily: FONT.medium,
    marginTop: hp(0.4),
  },
  modalButton: {
    marginTop: hp(1.3),
    backgroundColor: palette.blue,
    borderRadius: radius.pill,
    paddingHorizontal: wp(7),
    paddingVertical: hp(0.8),
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.semiBold,
  },
});

export default SpinWinScreen;
