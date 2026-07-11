import React from 'react';
import {Image} from 'react-native';

/**
 * Renders an icon that might be:
 * - a React component (when SVG transformer is configured), OR
 * - a numeric asset id (when Metro treats `.svg` like an image asset).
 */
const SvgIcon = ({
  icon,
  width,
  height,
  style,
  resizeMode = 'contain',
  ...props
}) => {
  if (!icon) {
    return null;
  }

  // Resolve default export if present (some bundlers wrap it).
  const resolved = icon?.default ?? icon;

  // Metro without SVG transformer: importing `.svg` often yields a numeric asset id.
  // Some setups wrap it under `.default`, so we check after resolving too.
  if (typeof resolved === 'number') {
    return (
      <Image
        source={resolved}
        resizeMode={resizeMode}
        style={[{width, height}, style]}
      />
    );
  }

  const IconComponent = resolved;
  return <IconComponent width={width} height={height} style={style} {...props} />;
};

export default SvgIcon;

