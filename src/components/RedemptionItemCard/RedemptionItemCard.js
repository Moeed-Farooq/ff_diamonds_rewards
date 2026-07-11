import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { ScalePressable } from '../ui';
import { hp } from '../../enums/StyleGuide';

const RedemptionItemCard = ({ item, styles }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressRatio = item.goal === 0 ? 0 : item.progress / item.goal;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressRatio,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, progressRatio]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScalePressable style={styles.itemWrap}>
      <LinearGradient colors={['#1E2857', '#1A2A5B']} style={styles.itemCard}>
        <View style={styles.itemImageBox}>
          <Label style={styles.itemImageText}>{item.title}</Label>
        </View>
        <Label style={styles.itemTitle}>{item.subtitle}</Label>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: widthInterpolate }]} />
        </View>
        <Label style={styles.itemProgressText}>
          {item.progress} / {item.goal}
        </Label>
        <MaterialCommunityIcons name="lock" size={hp(2.6)} color="#A3ADCB" />
      </LinearGradient>
    </ScalePressable>
  );
};

export default RedemptionItemCard;
