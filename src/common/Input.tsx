/* eslint-disable react-native/no-inline-styles */
import { TextInput, View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Label from './Label';
import { KEYBOARD_TYPE } from '../enums';
import { COLORS, TEXT_STYLE, commonStyles, hp, wp } from '../enums/StyleGuide';
import VectorIcon from './VectoreIcon';

interface inputProps {
  value?: string;
  keyboard?: any;
  title?: string;
  color?: string;
  style?: ViewStyle;
  multiline?: boolean;
  isPassword?: boolean;
  placeholder?: string;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  titleStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIconContainerStyle?: ViewStyle;
  onChange?: (val: string) => void;
  cursorColor?: string;
}

const Input: React.FC<inputProps> = props => {
  const {
    placeholder = '',
    value = '',
    style,
    title,
    onChange = () => { },
    multiline,
    titleStyle,
    labelStyle,
    isPassword = false,
    inputStyle,
    color = COLORS.grey,
    leftIcon,
    rightIcon,
    leftIconContainerStyle,
    keyboard = KEYBOARD_TYPE.DEFAULT,
    cursorColor = COLORS.lightYellow,
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(isPassword);

  return (
    <>
      {title && (
        <View style={[styles.labelContainer, titleStyle]}>
          <Label style={[styles.label, labelStyle]}>{title}</Label>
        </View>
      )}
      <View style={[styles.container, isFocused && styles.focusedInput, style]}>
        {leftIcon && <View style={[styles.icon, leftIconContainerStyle]}>{leftIcon}</View>}
        <TextInput
          value={value}
          blurOnSubmit={false}
          multiline={multiline}
          keyboardType={keyboard}
          placeholder={placeholder}
          cursorColor={cursorColor}
          placeholderTextColor={color}
          secureTextEntry={isPassword && showPassword}
          onChangeText={onChange}
          style={[
            styles.input,
            multiline && { textAlignVertical: 'top' },
            inputStyle,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View style={styles.icon}>
          {isPassword ? (
            <VectorIcon
              type="Ionicons"
              name={showPassword ? 'eye-off' : 'eye'}
              size={hp(2.5)}
              color={COLORS.grey}
              onPress={() => setShowPassword(prev => !prev)}
            />
          ) : (
            rightIcon
          )}
        </View>
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    height: hp(5.5),
    borderRadius: hp(1.2),
    paddingHorizontal: '4%',
    ...commonStyles.horizontalView,
    borderWidth: 1,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    marginBottom: hp(0.5),
    marginTop: hp(0.8),
  },
  input: {
    height: '100%',
    flex: 1,
    ...TEXT_STYLE.text,
    fontSize: 15,
    color: COLORS.black,
    justifyContent: 'center',
    fontWeight: 'semibold',
    marginLeft: 10,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    ...commonStyles.horizontalView,
    marginTop: hp(0.8),
  },
  label: {
    ...TEXT_STYLE.textMedium,
    fontSize: 12,
    color: COLORS.black,
  },
  focusedInput: {
    borderColor: COLORS.lightGrey,
    borderWidth: 1.5,
    backgroundColor: COLORS.white,
  },
});
