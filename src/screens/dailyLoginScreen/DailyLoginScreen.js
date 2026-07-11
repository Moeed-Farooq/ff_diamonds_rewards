import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { weeklyRewards } from '../../dummies';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { AppHeader } from '../../components';

const DailyLoginScreen = ({ navigation }) => {
  const [isClaimed, setClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const streakDay = useMemo(() => 0, []);

  const onClaim = () => {
    if (isClaimed) {
      return;
    }
    setClaimed(true);
    setShowModal(true);
  };

  return (
    <AppScreen>
      <AppHeader
        title={en.dailyLogin.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        showCoinPill
        coins={0}
        variant="topbar"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.streakCard}>
          <MaterialCommunityIcons
            name="calendar-month"
            size={hp(6.4)}
            color={palette.orange}
          />
          <Label style={styles.streakTitle}>{en.dailyLogin.streakTitle}</Label>
          <Label style={styles.streakSubtitle}>
            {en.dailyLogin.dayProgress
              .replace('{{day}}', `${streakDay}`)
              .replace('{{total}}', '7')}
          </Label>
        </View>

        <View style={styles.weeklyCard}>
          <Label style={styles.weeklyHeading}>
            {en.dailyLogin.weeklyRewards}
          </Label>
          <View style={styles.weeklyGrid}>
            {weeklyRewards.slice(0, 6).map((reward, index) => {
              const isFirst = index === 0;
              return (
                <ScalePressable key={`${reward}`} style={styles.rewardWrap}>
                  <LinearGradient
                    colors={
                      isFirst ? ['#FF6B3D', '#D66739'] : ['#173C78', '#173464']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.rewardTile,
                      isFirst && styles.activeRewardTile,
                    ]}
                  >
                    <Label style={styles.rewardDay}>
                      {en.dailyLogin.dayLabel} {index + 1}
                    </Label>
                    <View style={styles.rewardValueRow}>
                      <SvgIcon
                        icon={SVG.coins}
                        height={hp(2.6)}
                        width={hp(2.6)}
                      />
                      <Label style={styles.rewardValue}>{reward}</Label>
                    </View>
                  </LinearGradient>
                </ScalePressable>
              );
            })}
          </View>
        </View>

        <ScalePressable onPress={onClaim}>
          <LinearGradient
            colors={isClaimed ? ['#7E8BAA', '#67738C'] : ['#FF6B3D', '#FF723E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.claimButton}
          >
            <Label style={styles.claimText}>
              {isClaimed
                ? en.dailyLogin.alreadyClaimed
                : en.dailyLogin.claimCoins}
            </Label>
          </LinearGradient>
        </ScalePressable>
      </ScrollView>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Label style={styles.modalTitle}>{en.dailyLogin.modalTitle}</Label>
            <Label style={styles.modalText}>{en.dailyLogin.modalMessage}</Label>
            <ScalePressable
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Label style={styles.modalButtonText}>
                {en.dailyLogin.modalButton}
              </Label>
            </ScalePressable>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: hp(1.3),
    paddingBottom: hp(4),
  },
  streakCard: {
    borderRadius: radius.lg,
    backgroundColor: palette.card,
    paddingVertical: hp(2.3),
    alignItems: 'center',
    ...shadows.card,
  },
  streakTitle: {
    marginTop: hp(0.8),
    color: palette.textPrimary,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
  },
  streakSubtitle: {
    color: palette.orange,
    marginTop: hp(0.3),
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
  weeklyCard: {
    marginTop: hp(1.4),
    borderRadius: radius.lg,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: palette.card,
    ...shadows.card,
  },
  weeklyHeading: {
    color: palette.textPrimary,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
    marginBottom: hp(1),
  },
  weeklyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(1),
  },
  rewardWrap: {
    width: '48.5%',
  },
  rewardTile: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    paddingVertical: hp(1.6),
    alignItems: 'center',
  },
  activeRewardTile: {
    borderColor: '#FFAF7A',
    borderWidth: 2,
  },
  rewardDay: {
    color: '#E9F0FF',
    fontSize: hp(2.4),
    fontFamily: FONT.semiBold,
  },
  rewardValueRow: {
    marginTop: hp(0.6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  rewardValue: {
    color: '#F3F9FF',
    fontSize: hp(2.3),
    fontFamily: FONT.semiBold,
  },
  claimButton: {
    marginTop: hp(1.8),
    borderRadius: radius.pill,
    paddingVertical: hp(1.2),
    alignItems: 'center',
    ...shadows.card,
  },
  claimText: {
    color: '#FFFFFF',
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
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: '#1A2D61',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  modalTitle: {
    color:COLORS.green,
    fontSize: hp(3.1),
    fontFamily: FONT.semiBold,
  },
  modalText: {
    marginTop: hp(0.4),
    color: COLORS.white,
    fontSize: hp(1.8),
    textAlign: 'center',
    fontFamily: FONT.medium,
  },
  modalButton: {
    marginTop: hp(4.3),
    backgroundColor: palette.orange,
    borderRadius: radius.pill,
    paddingHorizontal: wp(7),
    paddingVertical: hp(0.8),
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
});

export default DailyLoginScreen;
