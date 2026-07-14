import { StatusBar, View } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from './src/enums/StyleGuide';
import RootNavigator from './src/navigation/RootNavigator';
import {
  initializeMobileAds,
  interstitialService,
  rewardedService,
} from './src/services/ads';


const App = () => {
  useEffect(() => {
    const bootAds = async () => {
      await initializeMobileAds();
      interstitialService.initialize();
      rewardedService.initialize();
    };

    bootAds().catch(error => {
      console.log('Ads bootstrap failed:', error?.message || error);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.black} barStyle={'light-content'} />
      <RootNavigator />
    </View>
  );
};

export default App;
