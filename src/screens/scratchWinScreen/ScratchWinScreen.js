import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { gradients, palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { AppHeader, RewardStatusModal } from '../../components';
import { scratchRewards } from '../../dummies';
import { useCoinsData, useRewardedAd } from '../../hooks';
import { canPlayScratch, getScratchRemainingTime } from '../../helpers';
import {
  claimScratchReward,
  grantExtraScratchFromRewardedAd,
} from '../../services/firebaseServices';

const seedCards = () => {
  return scratchRewards
    .sort(() => Math.random() - 0.5)
    .map((reward, index) => ({
      id: `${index}`,
      reward,
      isRevealed: false,
    }));
};

const ScratchWinScreen = ({ navigation }) => {
  const [cards] = useState(seedCards);
  const [loading, setLoading] = useState(false);
  const [isGrantingExtraScratch, setIsGrantingExtraScratch] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalTitle, setStatusModalTitle] = useState('');
  const [statusModalMessage, setStatusModalMessage] = useState('');
  const { scratchWin, refreshProfile } = useCoinsData();
  const { showRewardedAd, isLoading: isRewardedLoading } = useRewardedAd();

  const needsDailyReset =
    !!scratchWin.lastCompletedAt && canPlayScratch(scratchWin.lastCompletedAt);
  const dailyAvailable =
    !scratchWin.lastCompletedAt || needsDailyReset;
  const isWaitingForReset =
    !!scratchWin.lastCompletedAt && !canPlayScratch(scratchWin.lastCompletedAt);
  const extraScratches = isWaitingForReset
    ? Math.max(0, Number(scratchWin.extraScratches) || 0)
    : 0;
  const claimedCards = needsDailyReset ? [] : scratchWin.claimedCards || [];
  const canPlay = dailyAvailable || extraScratches > 0;
  const isActionBusy = loading || isGrantingExtraScratch || isRewardedLoading;
  const showWatchAdButton = isWaitingForReset && extraScratches === 0;

  useEffect(() => {
    if (!isWaitingForReset) {
      setRemainingTime('');
      return;
    }

    const update = () => {
      setRemainingTime(getScratchRemainingTime(scratchWin.lastCompletedAt));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [scratchWin.lastCompletedAt, isWaitingForReset]);

  const remainingCards = useMemo(() => {
    if (isWaitingForReset) {
      return extraScratches;
    }

    return 6 - claimedCards.length;
  }, [claimedCards, isWaitingForReset, extraScratches]);

  const openStatusModal = (title, message) => {
    setStatusModalTitle(title);
    setStatusModalMessage(message);
    setShowStatusModal(true);
  };

  const summarySubtitle = (() => {
    if (canPlay) {
      return en.scratchWin.remainingCards.replace(
        '{{count}}',
        `${remainingCards}`,
      );
    }

    if (isWaitingForReset && remainingTime) {
      return en.scratchWin.resetIn.replace('{{time}}', remainingTime);
    }

    return remainingTime || en.scratchWin.claimed;
  })();

  const revealCard = async card => {
    if (!canPlay || loading) {
      return;
    }
    if (claimedCards.includes(card.id)) {
      return;
    }
    try {
      setLoading(true);
      await claimScratchReward(card.id, card.reward);
      setSelectedReward(card.reward);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const grantAdBasedExtraScratch = async () => {
    if (isActionBusy || !showWatchAdButton) {
      return;
    }

    setIsGrantingExtraScratch(true);

    try {
      const adResult = await showRewardedAd();
      const didShowAd = Boolean(adResult?.shown);
      const rewardEarned = Boolean(adResult?.rewardEarned);

      if (!didShowAd) {
        openStatusModal(
          en.scratchWin.adUnavailableTitle,
          en.scratchWin.adUnavailableMessage,
        );
        return;
      }

      if (!rewardEarned) {
        openStatusModal(
          en.scratchWin.rewardNotEarnedTitle,
          en.scratchWin.rewardNotEarnedMessage,
        );
        return;
      }

      await grantExtraScratchFromRewardedAd();
      await refreshProfile();

      openStatusModal(
        en.scratchWin.freeScratchAddedTitle,
        en.scratchWin.freeScratchAddedMessage,
      );
    } catch (error) {
      openStatusModal(
        en.scratchWin.addScratchFailedTitle,
        error?.message || en.scratchWin.addScratchFailedMessage,
      );
    } finally {
      setIsGrantingExtraScratch(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader
        title={en.scratchWin.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        showCoinPill
        variant="topbar"
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <MaterialCommunityIcons
            name="gesture-tap-button"
            size={hp(6.7)}
            color={palette.purple}
          />
          <Label style={styles.summaryTitle}>{en.scratchWin.screenTitle}</Label>
          <Label style={styles.summaryText}>{summarySubtitle}</Label>
          {showWatchAdButton ? (
            <Label style={styles.summaryHint}>{en.scratchWin.watchAdHint}</Label>
          ) : null}
        </View>

        <View style={styles.grid}>
          {cards.map(card => {
            const isClaimed = claimedCards.includes(card.id);
            const isCardLocked = !canPlay || isClaimed;

            return (
              <ScalePressable
                key={card.id}
                style={styles.scratchTileWrap}
                onPress={() => revealCard(card)}
                disabled={isCardLocked || loading}
              >
                <LinearGradient
                  colors={
                    isClaimed
                      ? gradients.scratchClaimed
                      : canPlay
                      ? gradients.scratchAvailable
                      : gradients.scratchDisabled
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.scratchTile}
                >
                  {isClaimed ? (
                    <>
                      <SvgIcon
                        icon={SVG.coins}
                        height={hp(3.5)}
                        width={hp(3.5)}
                      />
                      <Label style={styles.revealedTitle}>
                        {card.reward} {en.scratchWin.coinsSuffix}
                      </Label>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="gesture-tap-button"
                        size={hp(4.9)}
                        color={COLORS.white}
                      />
                      <Label style={styles.tapLabel}>
                        {canPlay
                          ? en.scratchWin.tapToReveal
                          : en.scratchWin.claimed}
                      </Label>
                    </>
                  )}
                </LinearGradient>
              </ScalePressable>
            );
          })}
        </View>

        {showWatchAdButton ? (
          <ScalePressable
            onPress={grantAdBasedExtraScratch}
            disabled={isActionBusy}
          >
            <LinearGradient
              colors={gradients.rewardedAction}
              style={styles.watchAdButton}
            >
              <Label style={styles.watchAdButtonText}>
                {isRewardedLoading || isGrantingExtraScratch
                  ? en.scratchWin.buttonLoadingAd
                  : en.scratchWin.buttonWatchAd}
              </Label>
            </LinearGradient>
          </ScalePressable>
        ) : null}
      </ScrollView>

      <Modal transparent animationType="fade" visible={showModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Label style={styles.modalTitle}>{en.scratchWin.modalTitle}</Label>
            <Label style={styles.modalText}>
              {en.scratchWin.modalMessage.replace(
                '{{reward}}',
                `${selectedReward}`,
              )}
            </Label>
            <ScalePressable
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Label style={styles.modalButtonText}>
                {en.scratchWin.modalButton}
              </Label>
            </ScalePressable>
          </View>
        </View>
      </Modal>

      <RewardStatusModal
        visible={showStatusModal}
        title={statusModalTitle}
        message={statusModalMessage}
        buttonLabel={en.scratchWin.modalButton}
        onClose={() => setShowStatusModal(false)}
      />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  summaryCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    alignItems: 'center',
    paddingVertical: hp(2.1),
    ...shadows.card,
  },
  summaryTitle: {
    marginTop: hp(0.8),
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.bold,
  },
  summaryText: {
    marginTop: hp(0.3),
    color: palette.purple,
    fontSize: hp(2.5),
    fontFamily: FONT.bold,
    backgroundColor: COLORS.yellow,
    paddingHorizontal: hp(1),
    borderRadius: hp(1),
  },
  summaryHint: {
    marginTop: hp(0.8),
    color: COLORS.white,
    fontSize: hp(1.7),
    fontFamily: FONT.medium,
    textAlign: 'center',
    paddingHorizontal: wp(6),
  },
  grid: {
    marginTop: hp(2.4),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(1.1),
  },
  scratchTileWrap: {
    width: '48.5%',
  },
  scratchTile: {
    borderRadius: radius.md,
    minHeight: hp(16.5),
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(0.5),
    ...shadows.card,
  },
  tapLabel: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
  revealedTitle: {
    color: COLORS.green,
    fontSize: hp(2.6),
    fontFamily: FONT.semiBold,
  },
  watchAdButton: {
    marginTop: hp(2.4),
    borderRadius: radius.pill,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    ...shadows.card,
  },
  watchAdButtonText: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.semiBold,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.pageHorizontal,
  },
  modalCard: {
    width: '100%',
    backgroundColor: palette.pageBottom,
    borderRadius: radius.lg,
    paddingVertical: hp(1.9),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: hp(2.9),
    fontFamily: FONT.semiBold,
  },
  modalText: {
    marginTop: hp(0.4),
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.medium,
  },
  modalButton: {
    marginTop: hp(3.3),
    backgroundColor: palette.purple,
    borderRadius: radius.pill,
    paddingHorizontal: wp(7),
    paddingVertical: hp(0.75),
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.semiBold,
  },
});

export default ScratchWinScreen;
