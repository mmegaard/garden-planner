import React from "react";
import { PlantSvgProps } from "./types";

const HerbSprigIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#166534",
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
    {/* Main stem */}
    <path
      d="M32 58 C32 50, 30 40, 32 30 C34 20, 32 12, 32 8"
      stroke={accentColor}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Leaf pairs - bottom to top, getting smaller */}
    {/* Bottom pair */}
    <path d="M32 48 C24 44, 16 46, 14 50 C16 52, 24 52, 32 48Z" fill={color} />
    <path d="M32 48 C40 44, 48 46, 50 50 C48 52, 40 52, 32 48Z" fill={color} />
    {/* Middle pair */}
    <path d="M32 36 C26 32, 18 34, 18 38 C20 40, 26 40, 32 36Z" fill={color} opacity="0.9" />
    <path d="M32 36 C38 32, 46 34, 46 38 C44 40, 38 40, 32 36Z" fill={color} opacity="0.9" />
    {/* Upper pair */}
    <path d="M32 24 C28 20, 22 22, 22 26 C24 28, 28 28, 32 24Z" fill={color} opacity="0.85" />
    <path d="M32 24 C36 20, 42 22, 42 26 C40 28, 36 28, 32 24Z" fill={color} opacity="0.85" />
    {/* Top leaves (small) */}
    <path d="M32 14 C30 12, 26 12, 26 14 C28 16, 30 16, 32 14Z" fill={color} opacity="0.8" />
    <path d="M32 14 C34 12, 38 12, 38 14 C36 16, 34 16, 32 14Z" fill={color} opacity="0.8" />
    {/* Flower buds at top (accent) */}
    <circle cx="30" cy="8" r="2" fill={accentColor} opacity="0.5" />
    <circle cx="34" cy="9" r="1.5" fill={accentColor} opacity="0.5" />
  </svg>
);

export default HerbSprigIcon;
