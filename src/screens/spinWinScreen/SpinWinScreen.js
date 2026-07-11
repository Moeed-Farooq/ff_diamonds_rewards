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
import { wheelRewards } from '../../dummies';
import { palette, radius, shadows, spacing } from '../../constants/theme';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { AppHeader } from '../../components';
import SpinWheelGraphic from '../../components/SpinWheelGraphic';

const size = wp(72);
const radiusCircle = size / 2;
const center = radiusCircle;
const segmentColors = ['#EF4A48', '#3094EB', '#56B662', '#F09A17', '#9B37BC'];

const SpinWinScreen = ({ navigation }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);
  const [remainingSpins, setRemainingSpins] = useState(5);
  const [isSpinning, setSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wonReward, setWonReward] = useState(0);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const segment = useMemo(() => 360 / wheelRewards.length, []);

  const spin = () => {
    if (isSpinning || remainingSpins <= 0) {
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
    }).start(() => {
      currentRotation.current = finalRotation;
      setRemainingSpins(value => Math.max(value - 1, 0));
      setWonReward(wheelRewards[selectedIndex]);
      setShowModal(true);
      setSpinning(false);
    });
  };

  return (
    <AppScreen>
      <AppHeader
        title={en.spinWin.screenTitle}
        showBackButton
        onLeftPress={() => navigation.goBack()}
        showCoinPill
        coins={0}
        variant="topbar"
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
              segmentColors={segmentColors}
              center={center}
              radiusCircle={radiusCircle}
              textStyle={{
                fill: '#F6FAFF',
                fontSize: hp(2.2),
                fontFamily: FONT.bold,
              }}
            />
          </Animated.View>
        </View>

        <ScalePressable
          onPress={spin}
          disabled={isSpinning || remainingSpins <= 0}
        >
          <LinearGradient
            colors={
              remainingSpins <= 0
                ? ['#7281A5', '#62708E']
                : ['#2FA4FF', '#2D89E1']
            }
            style={styles.spinButton}
          >
            <Label style={styles.spinButtonText}>
              {remainingSpins <= 0
                ? en.spinWin.buttonNoSpins
                : en.spinWin.buttonSpin}
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
    backgroundColor: 'rgba(56,148,243,0.2)',
  },
  pointer: {
    position: 'absolute',
    zIndex: 5,
    top: hp(-0.8),
    backgroundColor: '#F6FAFF',
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
