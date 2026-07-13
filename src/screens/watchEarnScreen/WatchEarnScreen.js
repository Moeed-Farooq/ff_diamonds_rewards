import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, PlatformColor, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { AppScreen, ScalePressable } from '../../components/ui';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { AppHeader } from '../../components';

const WatchEarnScreen = ({ navigation }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const [showModal, setShowModal] = useState(false);

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
            <ScalePressable onPress={() => setShowModal(true)}>
              <LinearGradient
                colors={['#55C45D', '#44AB51']}
                style={styles.watchButton}
              >
                <MaterialCommunityIcons
                  name="play"
                  color="#F1F8FF"
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

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Label style={styles.modalTitle}>{en.watchEarn.modalTitle}</Label>
            <Label style={styles.modalText}>{en.watchEarn.modalMessage}</Label>
            <ScalePressable
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Label style={styles.modalButtonText}>
                {en.watchEarn.modalButton}
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: palette.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.pageHorizontal,
  },
  modalCard: {
    width: '100%',
    backgroundColor: palette.pageBottom,
    borderRadius: hp(2),
    paddingVertical: hp(4),
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: hp(3.1),
    fontFamily: FONT.semiBold,
  },
  modalText: {
    color: COLORS.white + HEX_OPACITY[83],
    fontSize: hp(2.1),
    marginBottom: hp(2),
    textAlign: 'center',
    fontFamily: FONT.medium,
  },
  modalButton: {
    marginTop: hp(1.3),
    backgroundColor: palette.green,
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

export default WatchEarnScreen;
