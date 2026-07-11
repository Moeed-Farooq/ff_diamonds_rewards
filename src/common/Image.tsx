import {StyleSheet} from 'react-native';
import React from 'react';
import FastImage, {ImageStyle} from 'react-native-fast-image';

interface ImageProps {
  src?: any;
  style?: ImageStyle;
  contain?: boolean;
  url?: string | undefined;
  alt?: any;
}

export const Image: React.FC<ImageProps> = props => {
  const {src, style, contain = false, url = '', alt} = props;

  // Check if both url and src are empty or undefined
  const isImageUndefined = (!url || url === '') && !src;

  return (
    <FastImage
      source={
        isImageUndefined
          ? typeof alt === 'string'
            ? {uri: alt}
            : alt
          : src || {uri: url}
      }
      style={[styles.image, style]}
      resizeMode={
        contain ? FastImage.resizeMode.contain : FastImage.resizeMode.cover
      }
    />
  );
};

export default Image;

const styles = StyleSheet.create({
  image: {
  },
});
