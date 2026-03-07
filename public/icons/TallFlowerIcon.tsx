import React from "react";
import { PlantSvgProps } from "./types";

const TallFlowerIcon: React.FC<PlantSvgProps> = ({
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
    <path d="M32 60 L32 14" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
    {/* Leaves along stem */}
    <path d="M32 52 C26 48, 20 50, 20 52 C22 54, 28 54, 32 52Z" fill={accentColor} opacity="0.7" />
    <path d="M32 44 C38 40, 44 42, 44 44 C42 46, 36 46, 32 44Z" fill={accentColor} opacity="0.7" />
    {/* Flower spike - cluster of small blooms going up */}
    <circle cx="32" cy="34" r="4" fill={color} opacity="0.6" />
    <circle cx="30" cy="28" r="4.5" fill={color} opacity="0.7" />
    <circle cx="34" cy="28" r="4.5" fill={color} opacity="0.7" />
    <circle cx="32" cy="22" r="5" fill={color} opacity="0.8" />
    <circle cx="30" cy="16" r="4.5" fill={color} opacity="0.9" />
    <circle cx="34" cy="16" r="4.5" fill={color} opacity="0.9" />
    <circle cx="32" cy="10" r="4" fill={color} />
    <circle cx="32" cy="5" r="3" fill={color} opacity="0.8" />
  </svg>
);

export default TallFlowerIcon;
