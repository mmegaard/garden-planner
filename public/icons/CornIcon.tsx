import React from "react";
import { PlantSvgProps } from "./types";

const CornIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#16A34A",
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
    {/* Silk tassels */}
    <path d="M28 8 Q26 4, 24 2" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M32 8 L32 2" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M36 8 Q38 4, 40 2" stroke="#D4A017" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    {/* Husk leaves */}
    <path
      d="M20 20 C12 24, 10 36, 14 44 Q16 40, 22 30Z"
      fill={accentColor}
      opacity="0.7"
    />
    <path
      d="M44 20 C52 24, 54 36, 50 44 Q48 40, 42 30Z"
      fill={accentColor}
      opacity="0.7"
    />
    {/* Ear body */}
    <path
      d="M24 8 C20 12, 18 24, 18 36 C18 48, 22 56, 26 58 Q32 62, 38 58 C42 56, 46 48, 46 36 C46 24, 44 12, 40 8 Q32 4, 24 8Z"
      fill={color}
    />
    {/* Kernel rows */}
    <circle cx="28" cy="16" r="2" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="36" cy="16" r="2" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="26" cy="24" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="32" cy="22" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="38" cy="24" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="26" cy="32" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="32" cy="30" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="38" cy="32" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="26" cy="40" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="32" cy="38" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="38" cy="40" r="2.5" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="28" cy="48" r="2" fill={color} opacity="0.3" filter="brightness(1.2)" />
    <circle cx="36" cy="48" r="2" fill={color} opacity="0.3" filter="brightness(1.2)" />
  </svg>
);

export default CornIcon;
