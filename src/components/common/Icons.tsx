/** This common component is used for custom icons, not present in MUI */
import gangotri from 'assets/images/gangotriGlacier.jpg';
import React from 'react';

type IconProps = {
  icon: string;
  width?: string;
  height?: string;
  altText?: string;
  className?: string;
};

type IconMapping = { [key: string]: string };

const iconMappings: IconMapping = {
  gangotri,
};

const Icon: React.FC<IconProps> = ({
  icon,
  className,
  width = 'auto',
  height = 'auto',
  altText = `${icon}-icon`,
}) => (
  <img
    src={iconMappings[icon]}
    alt={altText}
    className={className}
    width={width}
    height={height}
  />
);

export default Icon;
