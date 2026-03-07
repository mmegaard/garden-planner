import React from "react";
import { PlantSvgProps } from "./types";

const BeanIcon: React.FC<PlantSvgProps> = ({
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
    {/* Stem */}
    <path d="M18 10 Q16 6, 14 4" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Pod body - long curved bean */}
    <path
      d="M18 10 C24 8, 36 12, 44 22 C52 32, 52 44, 48 52 Q44 58, 40 54 C36 48, 32 38, 26 30 C20 22, 16 16, 18 10Z"
      fill={color}
    />
    {/* Bean bumps inside pod */}
    <ellipse cx="26" cy="18" rx="4" ry="3" fill={color} opacity="0.3" filter="brightness(1.15)" />
    <ellipse cx="34" cy="26" rx="4.5" ry="3.5" fill={color} opacity="0.3" filter="brightness(1.15)" />
    <ellipse cx="42" cy="36" rx="4.5" ry="3.5" fill={color} opacity="0.3" filter="brightness(1.15)" />
    <ellipse cx="46" cy="46" rx="3.5" ry="3" fill={color} opacity="0.3" filter="brightness(1.15)" />
    {/* Seam line */}
    <path
      d="M20 12 C26 14, 38 24, 46 38 Q50 46, 46 52"
      stroke={accentColor}
      strokeWidth="1"
      opacity="0.3"
      fill="none"
    />
  </svg>
);

export default BeanIcon;
