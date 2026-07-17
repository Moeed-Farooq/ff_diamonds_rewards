import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Label from '../../common/Label';
import { palette } from '../../constants/theme';
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
      <View style={[styles.itemCard, { backgroundColor: palette.card }]}>
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
        <MaterialCommunityIcons
          name="lock"
          size={hp(2.6)}
          color={palette.lockMuted}
        />
      </View>
    </ScalePressable>
  );
};

export default RedemptionItemCard;
