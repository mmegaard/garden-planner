import React from "react";
import { PlantSvgProps } from "./types";

const EggplantIcon: React.FC<PlantSvgProps> = ({
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
    <path d="M30 8 L32 4 L34 8" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    {/* Body - teardrop, slightly curved */}
    <path
      d="M24 14 C16 22, 14 36, 18 46 C22 54, 30 60, 34 58 C40 56, 48 46, 48 34 C48 24, 42 14, 36 12 Q32 10, 24 14Z"
      fill={color}
    />
    {/* Highlight */}
    <path
      d="M22 24 C20 32, 20 40, 24 48"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.15"
    />
    {/* Calyx cap */}
    <path
      d="M24 14 C26 10, 30 12, 32 10 C34 12, 38 10, 40 14 C36 12, 28 12, 24 14Z"
      fill={accentColor}
    />
    <path
      d="M28 14 C26 8, 22 6, 20 10 M36 14 C38 8, 42 6, 44 10"
      stroke={accentColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default EggplantIcon;
