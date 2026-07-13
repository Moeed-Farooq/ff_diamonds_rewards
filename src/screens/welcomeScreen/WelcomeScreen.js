import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Label from '../../common/Label';
import { ScalePressable } from '../../components/ui';
import { ensureUserProfile } from '../../services/firebaseServices';
import { SCREEN, TAB } from '../../enums';
import { hp, wp, FONT, COLORS } from '../../enums/StyleGuide';
import { palette, radius } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    if (!username.trim()) {
      Alert.alert('Username required');

      return;
    }

    if (!gameId.trim()) {
      Alert.alert('Game ID required');

      return;
    }

    try {
      setLoading(true);

      await ensureUserProfile({
        username,

        gameId,
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
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={[palette.pageTop, palette.pageBottom]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Label style={styles.title}>Welcome 👋</Label>

        <Label style={styles.subtitle}>
          Complete your profile to continue.
        </Label>

        <TextInput
          placeholder="Username"
          placeholderTextColor={COLORS.white}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Game ID"
          placeholderTextColor={COLORS.white}
          value={gameId}
          onChangeText={setGameId}
          style={styles.input}
          inputMode="numeric"
        />

        <ScalePressable
          style={styles.button}
          onPress={onContinue}
          disabled={loading}
        >
          <Label style={styles.buttonText}>
            {loading ? 'Please wait...' : 'Continue'}
          </Label>
        </ScalePressable>
      </View>
    </LinearGradient>
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
    justifyContent: 'center',
    paddingHorizontal: wp(6),
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
    color: '#bbb',
    marginBottom: hp(3),
  },
  input: {
    height: 55,
    backgroundColor: '#1F2A44',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    color: 'white',
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
    color: 'white',
    fontSize: hp(2),
  },
});
