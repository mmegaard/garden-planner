import React from "react";
import { PlantSvgProps } from "./types";

const PepperIcon: React.FC<PlantSvgProps> = ({
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
      d="M30 6 C30 6, 32 4, 34 6 L34 14 L30 14 Z"
      fill={accentColor}
    />
    <line x1="32" y1="4" x2="32" y2="10" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    {/* Body - bell pepper shape with lobes */}
    <path
      d="M22 16 C16 20, 12 30, 14 40 C16 50, 24 56, 28 58 Q32 60, 36 58 C40 56, 48 50, 50 40 C52 30, 48 20, 42 16 Q36 12, 32 14 Q28 12, 22 16Z"
      fill={color}
    />
    {/* Highlight */}
    <path
      d="M24 22 C20 28, 20 36, 22 42"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.2"
    />
    {/* Center crease */}
    <path
      d="M32 18 L32 52"
      stroke={color}
      strokeWidth="1"
      opacity="0.2"
      filter="brightness(0.6)"
    />
  </svg>
);

export default PepperIcon;
