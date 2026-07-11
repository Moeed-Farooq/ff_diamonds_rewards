import {ScrollView, ViewStyle} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import If from './If';

interface ScrollProps {
  children: React.ReactNode;
  hasInput: boolean;
  horizontal: boolean;
  style: ViewStyle;
}

const Scrollable: React.FC<ScrollProps> = ({
  children,
  hasInput,
  horizontal,
  style,
}) => {
  return (
    <If
      condition={hasInput}
      elseComp={
        <ScrollView
          bounces={false}
          horizontal={horizontal}
          overScrollMode={'never'}
          contentContainerStyle={style}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      }>
      <KeyboardAwareScrollView
        bounces={false}
        horizontal={horizontal}
        overScrollMode={'never'}
        contentContainerStyle={style}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {children}
      </KeyboardAwareScrollView>
    </If>
  );
};

export default Scrollable;
