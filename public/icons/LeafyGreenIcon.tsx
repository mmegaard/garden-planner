import React from "react";
import { PlantSvgProps } from "./types";

const LeafyGreenIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#15803D",
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
    {/* Back leaves */}
    <path
      d="M16 28 C10 20, 14 10, 24 12 C28 8, 36 8, 40 12 C50 10, 54 20, 48 28"
      fill={accentColor}
      opacity="0.6"
    />
    {/* Middle leaves */}
    <path
      d="M14 38 C8 28, 14 18, 22 18 Q32 14, 42 18 C50 18, 56 28, 50 38"
      fill={color}
      opacity="0.8"
    />
    {/* Front leaf - largest */}
    <path
      d="M12 48 C8 36, 14 26, 24 26 Q32 22, 40 26 C50 26, 56 36, 52 48 Q44 56, 32 58 Q20 56, 12 48Z"
      fill={color}
    />
    {/* Leaf veins */}
    <path d="M32 28 L32 54" stroke={accentColor} strokeWidth="1.5" opacity="0.3" />
    <path d="M32 34 L22 42" stroke={accentColor} strokeWidth="1" opacity="0.2" />
    <path d="M32 34 L42 42" stroke={accentColor} strokeWidth="1" opacity="0.2" />
    <path d="M32 42 L24 50" stroke={accentColor} strokeWidth="1" opacity="0.2" />
    <path d="M32 42 L40 50" stroke={accentColor} strokeWidth="1" opacity="0.2" />
  </svg>
);

export default LeafyGreenIcon;
