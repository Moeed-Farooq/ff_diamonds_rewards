import React from 'react';
import {ICONS} from '../assets';

interface AnyIconProps {
  type: keyof typeof ICONS;
  name: string;
  color?: string;
  size?: number;
  onPress?: () => void;
}

const VectorIcon: React.FC<AnyIconProps> = ({
  type,
  name,
  color,
  size = 25,
  ...props
}) => {
  const IconComponent = ICONS[type];

  return (
    <>
      {type && name && IconComponent && (
        <IconComponent name={name} size={size} color={color} {...props} />
      )}
    </>
  );
};

export default VectorIcon;
