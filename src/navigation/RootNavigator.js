import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import BottomNavigator from './BottomNavigator';
import * as ui from '../screens';
import { COLORS } from '../enums/StyleGuide';
import { SCREEN, TAB } from '../enums';
import { palette } from '../constants/theme';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={palette.pageTop} barStyle="light-content" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREEN.SPLASH_SCREEN} component={ui.SplashScreen} />
        <Stack.Screen name={TAB.BOTTOM} component={BottomNavigator} />
        <Stack.Screen
          name={SCREEN.DAILY_LOGIN_SCREEN}
          component={ui.DailyLoginScreen}
        />
        <Stack.Screen
          name={SCREEN.SCRATCH_WIN_SCREEN}
          component={ui.ScratchWinScreen}
        />
        <Stack.Screen
          name={SCREEN.SPIN_WIN_SCREEN}
          component={ui.SpinWinScreen}
        />
        <Stack.Screen
          name={SCREEN.WATCH_EARN_SCREEN}
          component={ui.WatchEarnScreen}
        />
        <Stack.Screen
          name={SCREEN.TRANSACTION_HISTORY_SCREEN}
          component={ui.TransactionHistoryScreen}
        />
        <Stack.Screen
          name={SCREEN.PRIVACY_POLICY_SCREEN}
          component={ui.PrivacyPolicyScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
