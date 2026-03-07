import React from "react";
import { PlantSvgProps } from "./types";

const BerryBushIcon: React.FC<PlantSvgProps> = ({
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
    {/* Main stem */}
    <path d="M32 60 L32 30" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
    {/* Branches */}
    <path d="M32 40 L20 32" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 40 L44 32" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 34 L24 24" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 34 L40 24" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M18 30 C14 26, 14 22, 18 24 C18 26, 18 28, 18 30Z" fill={accentColor} opacity="0.6" />
    <path d="M46 30 C50 26, 50 22, 46 24 C46 26, 46 28, 46 30Z" fill={accentColor} opacity="0.6" />
    <path d="M22 22 C18 18, 20 14, 24 18Z" fill={accentColor} opacity="0.5" />
    <path d="M42 22 C46 18, 44 14, 40 18Z" fill={accentColor} opacity="0.5" />
    {/* Berry clusters */}
    <circle cx="18" cy="30" r="4" fill={color} />
    <circle cx="14" cy="28" r="3.5" fill={color} opacity="0.9" />
    <circle cx="20" cy="26" r="3.5" fill={color} opacity="0.9" />
    <circle cx="46" cy="30" r="4" fill={color} />
    <circle cx="42" cy="28" r="3.5" fill={color} opacity="0.9" />
    <circle cx="48" cy="26" r="3.5" fill={color} opacity="0.9" />
    <circle cx="24" cy="20" r="3.5" fill={color} />
    <circle cx="22" cy="16" r="3" fill={color} opacity="0.9" />
    <circle cx="40" cy="20" r="3.5" fill={color} />
    <circle cx="42" cy="16" r="3" fill={color} opacity="0.9" />
    <circle cx="32" cy="26" r="3.5" fill={color} />
    {/* Berry highlights */}
    <circle cx="17" cy="28" r="1" fill="white" opacity="0.25" />
    <circle cx="45" cy="28" r="1" fill="white" opacity="0.25" />
    <circle cx="23" cy="18" r="1" fill="white" opacity="0.25" />
    <circle cx="39" cy="18" r="1" fill="white" opacity="0.25" />
  </svg>
);

export default BerryBushIcon;
