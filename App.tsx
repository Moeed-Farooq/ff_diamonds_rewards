import { AppState, StatusBar, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { COLORS } from './src/enums/StyleGuide';
import RootNavigator from './src/navigation/RootNavigator';
import {
  initializeMobileAds,
  interstitialService,
  preloadAppOpenAd,
  rewardedService,
  showAppOpenIfAvailable,
} from './src/services/ads';


const App = () => {
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const bootAds = async () => {
      await initializeMobileAds();
      interstitialService.initialize();
      rewardedService.initialize();
      preloadAppOpenAd();
    };

    bootAds().catch(error => {
      console.log('Ads bootstrap failed:', error?.message || error);
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        showAppOpenIfAvailable();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.black} barStyle={'light-content'} />
      <RootNavigator />
    </View>
  );
};

export default App;
