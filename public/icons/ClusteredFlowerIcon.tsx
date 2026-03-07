import React from "react";
import { PlantSvgProps } from "./types";

const ClusteredFlowerIcon: React.FC<PlantSvgProps> = ({
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
    <path d="M32 42 L32 58" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M32 52 C26 48, 18 50, 18 52 C20 54, 28 54, 32 52Z" fill={accentColor} opacity="0.7" />
    <path d="M32 48 C38 44, 46 46, 46 48 C44 50, 36 50, 32 48Z" fill={accentColor} opacity="0.7" />
    {/* Flower cluster - dense layered petals */}
    {/* Outer ring */}
    <circle cx="20" cy="28" r="6" fill={color} opacity="0.6" />
    <circle cx="44" cy="28" r="6" fill={color} opacity="0.6" />
    <circle cx="24" cy="38" r="6" fill={color} opacity="0.6" />
    <circle cx="40" cy="38" r="6" fill={color} opacity="0.6" />
    <circle cx="22" cy="18" r="5" fill={color} opacity="0.5" />
    <circle cx="42" cy="18" r="5" fill={color} opacity="0.5" />
    {/* Middle ring */}
    <circle cx="26" cy="24" r="7" fill={color} opacity="0.8" />
    <circle cx="38" cy="24" r="7" fill={color} opacity="0.8" />
    <circle cx="26" cy="34" r="6" fill={color} opacity="0.8" />
    <circle cx="38" cy="34" r="6" fill={color} opacity="0.8" />
    {/* Center */}
    <circle cx="32" cy="28" r="8" fill={color} />
    {/* Center detail */}
    <circle cx="32" cy="28" r="3" fill={accentColor} opacity="0.3" />
  </svg>
);

export default ClusteredFlowerIcon;
