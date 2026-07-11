import {
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import If from './If';
import Label from './Label';
import Pressable from './Pressable';
import { COLORS, commonStyles, FONT, hp, TEXT_STYLE } from '../enums/StyleGuide';

interface ButtonProps {
  text: string;
  textStyle?: TextStyle;
  style?: ViewStyle;
  onPress: () => void;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = props => {
  const { text, textStyle, style, onPress, icon, isLoading = false } = props;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={[styles.container, style]}>

      <If
        condition={!isLoading}
        elseComp={<ActivityIndicator color={COLORS.white} />}>

        <If condition={icon}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
        </If>
        <View style={styles.textContainer}>
          <Label
            color={COLORS.white}
            style={[styles.titleStyle, textStyle]}>
            {text}
          </Label>
        </View>

      </If>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
    height: hp(6.5),
    borderRadius: hp(2.5),
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderWidth: 1,
    borderColor: COLORS.lightYellow,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 9,
    elevation: 7,
    flexDirection: 'row',
    gap: hp(2),
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    fontFamily: FONT.semiBold,
    marginBottom: -0,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.bgPurpleDark,
    textShadowColor: COLORS.lightYellow + '80',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
