import {TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import React from 'react';
import {ACTIVE_OPACITY} from '../enums/StyleGuide';
import {emptyFunction} from '.././helpers';

interface PressableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  opacity?: number;
}

const Pressable: React.FC<PressableProps> = props => {
  const {
    children,
    onPress = emptyFunction,
    style,
    opacity = ACTIVE_OPACITY,
  } = props;

  return (
    <TouchableOpacity
      {...props}
      style={style}
      activeOpacity={opacity}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Pressable;
