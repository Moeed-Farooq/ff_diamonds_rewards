import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../../constants/theme';

const AppScreen = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: palette.pageTop,
  },
  safeArea: {
    flex: 1,
  },
});

export default AppScreen;
