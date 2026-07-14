import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { gradients, palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { AppHeader, RewardStatusModal } from '../../components';
import { useCoinsData, useRewardedAd } from '../../hooks';
import { addCoins } from '../../services/firebaseServices';

const WATCH_REWARD_COINS = 20;

const WatchEarnScreen = ({ navigation }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(en.watchEarn.modalTitle);
  const [modalMessage, setModalMessage] = useState(en.watchEarn.modalMessage);
  const { refreshProfile } = useCoinsData();
  const { showRewardedAd, isLoading: isRewardedLoading } = useRewardedAd();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  const openResultModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const onWatchAdPress = async () => {
    if (isRewardedLoading) {
      return;
    }

    const adResult = await showRewardedAd();

    if (!adResult.shown) {
      openResultModal(
        en.watchEarn.adUnavailableTitle,
        en.watchEarn.adUnavailableMessage,
      );
      return;
    }

    if (!adResult.rewardEarned) {
      openResultModal(
        en.watchEarn.rewardNotEarnedTitle,
        en.watchEarn.rewardNotEarnedMessage,
      );
      return;
    }

    try {
      await addCoins(WATCH_REWARD_COINS, {
        type: 'watch',
        title: `Watch & Earn - ${WATCH_REWARD_COINS} coins`,
        screen: 'WatchEarnScreen',
        game: 'Watch & Earn',
        rewardSource: 'Rewarded Ad',
      });
      await refreshProfile();

      openResultModal(
        en.watchEarn.modalTitle,
        en.watchEarn.earnedCoinsMessage.replace(
          '{{reward}}',
          `${WATCH_REWARD_COINS}`,
        ),
      );
    } catch (error) {
      console.log('Failed to save rewarded coins:', error?.message || error);
      openResultModal(
        en.watchEarn.rewardPendingTitle,
        en.watchEarn.rewardPendingMessage,
      );
    }
  };

  return (
    <AppScreen>
      <AppHeader
        title={en.watchEarn.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        showCoinPill
        variant="topbar"
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCard}>
          <MaterialCommunityIcons
            name="play"
            size={hp(6.6)}
            color={palette.green}
          />
          <Label style={styles.topTitle}>{en.watchEarn.screenTitle}</Label>
          <Label style={styles.topDescription}>
            {en.watchEarn.topDescription}
          </Label>
        </View>

        <View style={styles.rewardedCard}>
          <Label style={styles.rewardedTitle}>
            {en.watchEarn.rewardedTitle}
          </Label>
          <Label style={styles.rewardedDescription}>
            {en.watchEarn.rewardedDescription}
          </Label>

          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <ScalePressable onPress={onWatchAdPress} disabled={isRewardedLoading}>
              <LinearGradient
                colors={gradients.rewardedAction}
                style={styles.watchButton}
              >
                <MaterialCommunityIcons
                  name="play"
                  color={palette.rewardedIconTint}
                  size={hp(2.7)}
                />
                <Label style={styles.watchButtonLabel}>
                  {en.watchEarn.button}
                </Label>
              </LinearGradient>
            </ScalePressable>
          </Animated.View>
        </View>
      </ScrollView>

      <RewardStatusModal
        visible={showModal}
        title={modalTitle}
        message={modalMessage}
        buttonLabel={en.watchEarn.modalButton}
        onClose={() => setShowModal(false)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.3),
    paddingBottom: hp(4),
  },
  topCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingVertical: hp(2.1),
    paddingHorizontal: wp(5),
    alignItems: 'center',
    ...shadows.card,
  },
  topTitle: {
    marginTop: hp(0.8),
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: FONT.bold,
  },
  topDescription: {
    marginTop: hp(0.7),
    color: COLORS.white + HEX_OPACITY[63],
    fontSize: hp(2.1),
    fontFamily: FONT.medium,
  },
  rewardedCard: {
    marginTop: hp(5),
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.9),
    ...shadows.card,
  },
  rewardedTitle: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.bold,
    textAlign:'center'
  },
  rewardedDescription: {
    marginTop: hp(0.5),
    color: COLORS.white + HEX_OPACITY[63],
    fontSize: hp(2.1),
    fontFamily: FONT.medium,
  },
  watchButton: {
    marginTop: hp(3.6),
    borderRadius: hp(2),
    paddingVertical: hp(1.1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1.2),
  },
  watchButtonLabel: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.medium,
  },
});

export default WatchEarnScreen;
