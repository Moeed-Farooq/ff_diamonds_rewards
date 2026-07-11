import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';

const ScalePressable = ({ children, style, onPress, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = to => {
    Animated.spring(scale, {
      toValue: to,
      speed: 28,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default ScalePressable;
