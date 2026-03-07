import React from "react";
import { PlantSvgProps } from "./types";

const SquashIcon: React.FC<PlantSvgProps> = ({
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
      d="M30 8 Q28 4, 26 6"
      stroke={accentColor}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Body - elongated gourd with narrow neck */}
    <path
      d="M28 10 C22 12, 20 18, 22 22 C18 26, 12 34, 14 44 C16 52, 24 58, 32 58 C40 58, 48 52, 50 44 C52 34, 46 26, 42 22 C44 18, 42 12, 36 10 Q32 8, 28 10Z"
      fill={color}
    />
    {/* Ridges */}
    <path d="M32 12 L32 56" stroke={color} strokeWidth="1" opacity="0.2" filter="brightness(0.6)" />
    <path d="M24 16 Q22 36, 24 54" stroke={color} strokeWidth="0.8" opacity="0.15" filter="brightness(0.6)" />
    <path d="M40 16 Q42 36, 40 54" stroke={color} strokeWidth="0.8" opacity="0.15" filter="brightness(0.6)" />
    {/* Highlight */}
    <ellipse cx="27" cy="38" rx="4" ry="10" fill="white" opacity="0.12" />
  </svg>
);

export default SquashIcon;
