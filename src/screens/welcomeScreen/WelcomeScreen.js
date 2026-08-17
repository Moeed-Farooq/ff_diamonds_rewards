import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Label from '../../common/Label';
import { ScalePressable } from '../../components/ui';
import { ensureUserProfile } from '../../services/firebaseServices';
import { TAB } from '../../enums';
import { hp, wp, FONT, COLORS, HEX_OPACITY } from '../../enums/StyleGuide';
import { palette } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { en } from '../../languages';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [continueLoading, setContinueLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const isAnyLoading = continueLoading || guestLoading;

  const onContinue = async () => {
    if (!username.trim()) {
      Alert.alert(en.welcome.usernameRequired);

      return;
    }

    if (!gameId.trim()) {
      Alert.alert(en.welcome.gameIdRequired);

      return;
    }

    try {
      setContinueLoading(true);

      await ensureUserProfile({
        username,
        gameId,
        isGuest: false,
      });

      navigation.reset({
        index: 0,

        routes: [
          {
            name: TAB.BOTTOM,
          },
        ],
      });
    } catch (e) {
      Alert.alert(en.welcome.errorTitle, e.message);
    } finally {
      setContinueLoading(false);
    }
  };

  const onGuestContinue = async () => {
    try {
      setGuestLoading(true);
      const guestGameId = Math.floor(
        10000000 + Math.random() * 90000000,
      ).toString();

      await ensureUserProfile({
        username: 'Guest',
        gameId: guestGameId,
        isGuest: true,
      });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: TAB.BOTTOM,
          },
        ],
      });
    } catch (e) {
      Alert.alert(en.welcome.errorTitle, e.message);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[palette.pageTop, palette.pageBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.card}>
        <Label style={styles.title}>{en.welcome.title}</Label>

        <Label style={styles.subtitle}>{en.welcome.subtitle}</Label>

        <TextInput
          placeholder={en.welcome.usernamePlaceholder}
          placeholderTextColor={COLORS.white}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder={en.welcome.gameIdPlaceholder}
          placeholderTextColor={COLORS.white}
          value={gameId}
          onChangeText={setGameId}
          style={styles.input}
          inputMode="numeric"
        />

        <ScalePressable
          style={styles.button}
          onPress={onContinue}
          disabled={isAnyLoading}
        >
          <Label style={styles.buttonText}>
            {continueLoading ? en.welcome.loading : en.welcome.continue}
          </Label>
        </ScalePressable>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Label style={styles.dividerText}>{en.welcome.orDivider}</Label>
          <View style={styles.dividerLine} />
        </View>

        <ScalePressable
          style={styles.guestButton}
          onPress={onGuestContinue}
          disabled={isAnyLoading}
        >
          <Label style={styles.guestButtonText}>
            {guestLoading ? en.welcome.loading : en.welcome.guestMode}
          </Label>
        </ScalePressable>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20, // Standard padding taake corners se safe rahe
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    backgroundColor: palette.pageTop,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 25,
    padding: 24,
  },
  title: {
    fontSize: hp(3.6),
    fontFamily: FONT.bold,
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: hp(0.8),
    textAlign: 'center',
    color: palette.welcomeSubtitle,
    marginBottom: hp(3),
  },
  input: {
    height: 55,
    backgroundColor: palette.welcomeInputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    color: COLORS.white,
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.orange,
  },
  buttonText: {
    fontFamily: FONT.bold,
    color: COLORS.white,
    fontSize: hp(2),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.white + HEX_OPACITY[30],
  },
  dividerText: {
    marginHorizontal: wp(3),
    color: palette.welcomeSubtitle,
    fontFamily: FONT.semiBold,
    fontSize: hp(1.6),
  },
  guestButton: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: palette.orange,
  },
  guestButtonText: {
    fontFamily: FONT.bold,
    color: palette.orange,
    fontSize: hp(2),
  },
});

