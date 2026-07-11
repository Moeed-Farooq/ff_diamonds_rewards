import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../enums/StyleGuide';
import { TAB } from '../../enums';
import Label from '../../common/Label';
import { palette } from '../../constants/theme';
import { en } from '../../languages';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: TAB.BOTTOM }],
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);
  
  return (
    <LinearGradient
      colors={[palette.pageTop, palette.pageBottom]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}
    >
      <View style={styles.logoWrap}>
        <MaterialCommunityIcons name="diamond-stone" size={hp(6.2)} color="#F3FAFF" />
      </View>
      <Label style={styles.title}>{en.app.ffDiamonds}</Label>
      <Label style={styles.subtitle}>{en.app.earnDiamondsDaily}</Label>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={palette.orange} />
        <Label style={styles.loadingText}>{en.app.loading}</Label>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  logoWrap: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    backgroundColor: '#FF6D3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  title: {
    fontSize: hp(4.8),
    fontWeight: '900',
    color: '#F5FAFF',
    marginBottom: hp(0.1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(3.1),
    fontWeight: '600',
    color: '#ABB8D5',
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
    color: '#E8F0FF',
    marginTop: hp(1),
    textAlign: 'center',
  },
});
