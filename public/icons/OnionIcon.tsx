import React from "react";
import { PlantSvgProps } from "./types";

const OnionIcon: React.FC<PlantSvgProps> = ({
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
    {/* Shoots */}
    <path d="M30 14 C28 6, 26 2, 28 4" stroke={accentColor} strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M34 14 C36 6, 38 2, 36 4" stroke={accentColor} strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Bulb body */}
    <path
      d="M22 18 C14 24, 12 36, 16 44 C20 52, 28 56, 32 56 C36 56, 44 52, 48 44 C52 36, 50 24, 42 18 Q38 14, 32 14 Q26 14, 22 18Z"
      fill={color}
    />
    {/* Layer lines */}
    <path d="M24 22 Q20 34, 24 48" stroke={color} strokeWidth="1" opacity="0.2" filter="brightness(0.7)" />
    <path d="M40 22 Q44 34, 40 48" stroke={color} strokeWidth="1" opacity="0.2" filter="brightness(0.7)" />
    <path d="M32 16 L32 54" stroke={color} strokeWidth="0.8" opacity="0.15" filter="brightness(0.7)" />
    {/* Highlight */}
    <ellipse cx="27" cy="32" rx="4" ry="8" fill="white" opacity="0.12" />
    {/* Root wisps */}
    <path d="M28 56 Q26 60, 24 62" stroke={accentColor} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    <path d="M32 56 L32 62" stroke={accentColor} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    <path d="M36 56 Q38 60, 40 62" stroke={accentColor} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
  </svg>
);

export default OnionIcon;
