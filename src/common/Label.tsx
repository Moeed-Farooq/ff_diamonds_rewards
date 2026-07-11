import { Text, StyleSheet, TextProps } from 'react-native';
import React from 'react';
import { COLORS, FONT } from '../enums/StyleGuide';

interface LabelProps extends TextProps {
  children: React.ReactNode;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Label: React.FC<LabelProps> = props => {
  const {
    children,
    style,
    color = COLORS.black,
    align = 'left',
  } = props;


  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[
        styles.textStyle,
        { color, textAlign: align },
        style,
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
  },
});

export default Label;
