import React from "react";
import { PlantSvgProps } from "./types";

const PumpkinIcon: React.FC<PlantSvgProps> = ({
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
    {/* Stem */}
    <path
      d="M30 12 Q28 6, 30 4 L34 4 Q36 6, 34 12"
      fill={accentColor}
    />
    {/* Curly vine */}
    <path
      d="M36 6 C40 4, 44 6, 42 10"
      stroke={accentColor}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Body - wide pumpkin with lobes */}
    <path
      d="M10 36 C10 22, 18 14, 24 14 Q28 12, 32 14 Q36 12, 40 14 C46 14, 54 22, 54 36 C54 48, 46 56, 40 56 Q36 58, 32 56 Q28 58, 24 56 C18 56, 10 48, 10 36Z"
      fill={color}
    />
    {/* Ridges */}
    <path d="M32 14 L32 56" stroke={color} strokeWidth="1.5" opacity="0.2" filter="brightness(0.6)" />
    <path d="M22 16 Q16 36, 22 54" stroke={color} strokeWidth="1" opacity="0.15" filter="brightness(0.6)" />
    <path d="M42 16 Q48 36, 42 54" stroke={color} strokeWidth="1" opacity="0.15" filter="brightness(0.6)" />
    {/* Highlight */}
    <ellipse cx="24" cy="34" rx="5" ry="10" fill="white" opacity="0.1" />
  </svg>
);

export default PumpkinIcon;
