import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { SCREEN, TAB } from '../../enums';
import Label from '../../common/Label';
import { palette } from '../../constants/theme';
import { en } from '../../languages';
import Image from '../../common/Image';
import { IMAGES } from '../../assets/images';
import {
  hasCompletedOnboarding,
  updateDailyStreak,
} from '../../services/firebaseServices';
import { showAppOpenIfAvailable } from '../../services/ads';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;

    const navigateTo = routeName => {
      if (!mounted) {
        return;
      }

      const go = () => {
        if (!mounted) {
          return;
        }

        navigation.reset({
          index: 0,
          routes: [{ name: routeName }],
        });
      };

      const shown = showAppOpenIfAvailable({
        onClosed: go,
        onError: go,
      });

      if (!shown) {
        go();
      }
    };

    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1800));
        const result = await hasCompletedOnboarding();
        await updateDailyStreak();
        if (!mounted) return;
        navigateTo(result.isCompleted ? TAB.BOTTOM : SCREEN.WELCOME_SCREEN);
      } catch (e) {
        navigateTo(SCREEN.WELCOME_SCREEN);
      }
    };
    initializeApp();
    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[palette.pageTop, palette.pageBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.logoWrap}>
        <Image src={IMAGES.LOGO} style={styles.logo} />
      </View>
      <Label style={styles.title}>{en.app.ffDiamonds}</Label>
      <Label style={styles.subtitle}>{en.app.earnDiamondsDaily}</Label>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={palette.orange} />
        <Label style={styles.loadingText}>{en.app.loading}</Label>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    backgroundColor: palette.pageTop,
  },
  logoWrap: {
    width: hp(15),
    height: hp(15),
    borderRadius: hp(4),
    backgroundColor: palette.pageBottom,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(4.5),
  },
  title: {
    fontSize: hp(4.4),
    fontFamily: FONT.bold,
    color: COLORS.white,
    marginBottom: hp(0.1),
    textAlign: 'center',
  },
  logo: {
    width: hp(12),
    height: hp(12),
  },
  subtitle: {
    fontSize: hp(2.1),
    fontFamily: FONT.semiBold,
    color: COLORS.white + HEX_OPACITY[66],
    marginBottom: hp(5),
    textAlign: 'center',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(5.5),
  },
  loadingText: {
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
    color: COLORS.accent,
    marginTop: hp(1),
    textAlign: 'center',
  },
});
