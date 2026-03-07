import React from "react";
import { PlantSvgProps } from "./types";

const TomatoIcon: React.FC<PlantSvgProps> = ({
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
      d="M32 8 L32 18"
      stroke={accentColor}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Main body */}
    <ellipse cx="32" cy="36" rx="20" ry="19" fill={color} />
    {/* Subtle highlight */}
    <ellipse cx="26" cy="30" rx="6" ry="8" fill="white" opacity="0.15" />
    {/* Calyx (star-shaped leaves on top) */}
    <path
      d="M32 20 C28 14, 20 16, 22 22 C18 18, 14 24, 20 26
         M32 20 C36 14, 44 16, 42 22 C46 18, 50 24, 44 26
         M32 20 C32 12, 26 10, 28 16
         M32 20 C32 12, 38 10, 36 16"
      stroke={accentColor}
      strokeWidth="1.5"
      fill={accentColor}
      opacity="0.9"
    />
    {/* Bottom crease */}
    <path
      d="M26 50 Q32 54, 38 50"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
      filter="brightness(0.7)"
    />
  </svg>
);

export default TomatoIcon;
