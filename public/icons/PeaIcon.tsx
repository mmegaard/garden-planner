import React from "react";
import { PlantSvgProps } from "./types";

const PeaIcon: React.FC<PlantSvgProps> = ({
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
    {/* Tendril */}
    <path
      d="M14 14 C10 10, 8 14, 12 16"
      stroke={accentColor}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Pod - open at top showing peas */}
    <path
      d="M14 16 C10 22, 10 38, 16 48 C22 56, 34 58, 42 54 C50 48, 54 36, 52 26 C50 18, 44 14, 38 14 Q26 12, 14 16Z"
      fill={accentColor}
      opacity="0.85"
    />
    {/* Pod opening */}
    <path
      d="M16 18 C20 14, 34 12, 44 16"
      stroke={accentColor}
      strokeWidth="2"
      fill="none"
      filter="brightness(0.8)"
    />
    {/* Peas inside */}
    <circle cx="24" cy="30" r="7" fill={color} />
    <circle cx="34" cy="34" r="7" fill={color} />
    <circle cx="26" cy="42" r="6.5" fill={color} />
    {/* Pea highlights */}
    <circle cx="22" cy="28" r="2" fill="white" opacity="0.2" />
    <circle cx="32" cy="32" r="2" fill="white" opacity="0.2" />
    <circle cx="24" cy="40" r="1.8" fill="white" opacity="0.2" />
  </svg>
);

export default PeaIcon;
