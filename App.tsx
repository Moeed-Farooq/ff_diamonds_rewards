import { StatusBar, View } from 'react-native';
import React from 'react';
import { COLORS } from './src/enums/StyleGuide';
import RootNavigator from './src/navigation/RootNavigator';


const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.black} barStyle={'light-content'} />
      <RootNavigator />
    </View>
  );
};

export default App;
