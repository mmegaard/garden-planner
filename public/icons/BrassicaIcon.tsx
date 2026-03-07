import React from "react";
import { PlantSvgProps } from "./types";

const BrassicaIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#166534",
  size,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stalk */}
    <rect x="29" y="42" width="6" height="16" rx="2" fill={accentColor} />
    {/* Outer leaves */}
    <path
      d="M12 40 C8 32, 14 28, 20 32 L24 38 Q16 42, 12 40Z"
      fill={accentColor}
      opacity="0.7"
    />
    <path
      d="M52 40 C56 32, 50 28, 44 32 L40 38 Q48 42, 52 40Z"
      fill={accentColor}
      opacity="0.7"
    />
    {/* Floret head - cluster of bumpy circles */}
    <circle cx="32" cy="24" r="10" fill={color} />
    <circle cx="22" cy="28" r="8" fill={color} />
    <circle cx="42" cy="28" r="8" fill={color} />
    <circle cx="26" cy="18" r="7" fill={color} />
    <circle cx="38" cy="18" r="7" fill={color} />
    <circle cx="32" cy="14" r="6" fill={color} />
    <circle cx="18" cy="34" r="6" fill={color} />
    <circle cx="46" cy="34" r="6" fill={color} />
    {/* Subtle texture */}
    <circle cx="30" cy="20" r="2" fill="white" opacity="0.1" />
    <circle cx="36" cy="26" r="2" fill="white" opacity="0.1" />
    <circle cx="24" cy="28" r="1.5" fill="white" opacity="0.1" />
  </svg>
);

export default BrassicaIcon;
