import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigator from './BottomNavigator';
import * as ui from '../screens';
import { SCREEN, TAB } from '../enums';
import { palette } from '../constants/theme';
import { useUserProfile } from '../hooks';

const withRegisteredAccount = Component => {
  const GuardedScreen = props => {
    const navigation = useNavigation();
    const { isGuest, loading } = useUserProfile();

    useEffect(() => {
      if (loading || !isGuest) {
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: SCREEN.WELCOME_SCREEN }],
      });
    }, [isGuest, loading, navigation]);

    if (isGuest) {
      return null;
    }

    return <Component {...props} />;
  };

  return GuardedScreen;
};

const DailyLoginScreen = withRegisteredAccount(ui.DailyLoginScreen);
const ScratchWinScreen = withRegisteredAccount(ui.ScratchWinScreen);
const SpinWinScreen = withRegisteredAccount(ui.SpinWinScreen);
const WatchEarnScreen = withRegisteredAccount(ui.WatchEarnScreen);
const BlockPuzzleScreen = withRegisteredAccount(ui.BlockPuzzleScreen);
const TransactionHistoryScreen = withRegisteredAccount(
  ui.TransactionHistoryScreen,
);

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={palette.pageTop} barStyle="light-content" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREEN.SPLASH_SCREEN} component={ui.SplashScreen} />
        <Stack.Screen
          name={SCREEN.WELCOME_SCREEN}
          component={ui.WelcomeScreen}
        />
        <Stack.Screen name={TAB.BOTTOM} component={BottomNavigator} />
        <Stack.Screen
          name={SCREEN.DAILY_LOGIN_SCREEN}
          component={DailyLoginScreen}
        />
        <Stack.Screen
          name={SCREEN.SCRATCH_WIN_SCREEN}
          component={ScratchWinScreen}
        />
        <Stack.Screen
          name={SCREEN.SPIN_WIN_SCREEN}
          component={SpinWinScreen}
        />
        <Stack.Screen
          name={SCREEN.WATCH_EARN_SCREEN}
          component={WatchEarnScreen}
        />
        <Stack.Screen
          name={SCREEN.TRANSACTION_HISTORY_SCREEN}
          component={TransactionHistoryScreen}
        />
        <Stack.Screen
          name={SCREEN.PRIVACY_POLICY_SCREEN}
          component={ui.PrivacyPolicyScreen}
        />
        <Stack.Screen
          name={SCREEN.BLOCK_PUZZLE_SCREEN}
          component={BlockPuzzleScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
