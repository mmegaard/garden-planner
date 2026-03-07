import React from "react";
import { PlantSvgProps } from "./types";

const RootVeggieIcon: React.FC<PlantSvgProps> = ({
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
    {/* Greens on top */}
    <path
      d="M26 18 C22 8, 16 4, 14 8 C12 12, 18 16, 24 18"
      fill={accentColor}
      opacity="0.8"
    />
    <path
      d="M32 16 C32 6, 28 2, 30 6 C30 2, 34 2, 34 6 C36 2, 36 6, 32 16"
      fill={accentColor}
      opacity="0.9"
    />
    <path
      d="M38 18 C42 8, 48 4, 50 8 C52 12, 46 16, 40 18"
      fill={accentColor}
      opacity="0.8"
    />
    {/* Root body - tapered */}
    <path
      d="M22 20 C18 24, 20 34, 24 42 C28 50, 30 56, 32 60 C34 56, 36 50, 40 42 C44 34, 46 24, 42 20 Q36 16, 32 18 Q28 16, 22 20Z"
      fill={color}
    />
    {/* Highlight */}
    <path
      d="M26 24 C24 32, 26 42, 28 50"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.15"
    />
    {/* Root tip detail */}
    <path
      d="M32 58 Q33 62, 34 60"
      stroke={color}
      strokeWidth="1"
      opacity="0.5"
      filter="brightness(0.7)"
    />
  </svg>
);

export default RootVeggieIcon;
