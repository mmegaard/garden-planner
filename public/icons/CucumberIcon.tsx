import React from "react";
import { PlantSvgProps } from "./types";

const CucumberIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#4ADE80",
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
    {/* Stem nub */}
    <circle cx="32" cy="8" r="2.5" fill={accentColor} />
    {/* Body - long cylinder, slightly curved */}
    <path
      d="M26 10 C22 12, 20 20, 20 32 C20 44, 22 52, 26 56 Q32 60, 38 56 C42 52, 44 44, 44 32 C44 20, 42 12, 38 10 Q32 8, 26 10Z"
      fill={color}
    />
    {/* Bumps / texture */}
    <circle cx="28" cy="20" r="1.5" fill={accentColor} opacity="0.3" />
    <circle cx="36" cy="26" r="1.5" fill={accentColor} opacity="0.3" />
    <circle cx="28" cy="34" r="1.5" fill={accentColor} opacity="0.3" />
    <circle cx="36" cy="40" r="1.5" fill={accentColor} opacity="0.3" />
    <circle cx="30" cy="48" r="1.5" fill={accentColor} opacity="0.3" />
    {/* Highlight */}
    <path
      d="M26 14 C24 24, 24 40, 26 52"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.15"
    />
  </svg>
);

export default CucumberIcon;
