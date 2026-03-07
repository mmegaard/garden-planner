import React from "react";
import { PlantSvgProps } from "./types";

const DaisyFlowerIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#92400E",
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
    <path d="M32 42 L32 58" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Leaf on stem */}
    <path d="M32 50 C28 46, 22 48, 22 50 C24 52, 28 52, 32 50Z" fill="#16A34A" opacity="0.7" />
    {/* Petals */}
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(45 32 28)" />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(90 32 28)" />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(135 32 28)" />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(180 32 28)" />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(225 32 28)" />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(270 32 28)" />
    <ellipse cx="32" cy="14" rx="4" ry="9" fill={color} transform="rotate(315 32 28)" />
    {/* Center disc */}
    <circle cx="32" cy="28" r="7" fill={accentColor} />
    {/* Center texture */}
    <circle cx="30" cy="26" r="1" fill={accentColor} opacity="0.5" filter="brightness(1.3)" />
    <circle cx="34" cy="27" r="1" fill={accentColor} opacity="0.5" filter="brightness(1.3)" />
    <circle cx="32" cy="30" r="1" fill={accentColor} opacity="0.5" filter="brightness(1.3)" />
  </svg>
);

export default DaisyFlowerIcon;
