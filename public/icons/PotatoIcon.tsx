import React from "react";
import { PlantSvgProps } from "./types";

const PotatoIcon: React.FC<PlantSvgProps> = ({
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
    {/* Body - lumpy irregular oval */}
    <path
      d="M14 30 C12 22, 18 14, 28 14 C32 12, 38 12, 44 14 C52 16, 56 24, 54 32 C52 40, 48 48, 40 50 C34 52, 26 52, 20 48 C14 44, 12 38, 14 30Z"
      fill={color}
    />
    {/* Eyes (potato spots) */}
    <ellipse cx="24" cy="26" rx="2" ry="1.5" fill={color} opacity="0.4" filter="brightness(0.7)" />
    <ellipse cx="38" cy="22" rx="1.5" ry="1" fill={color} opacity="0.4" filter="brightness(0.7)" />
    <ellipse cx="42" cy="34" rx="2" ry="1.5" fill={color} opacity="0.4" filter="brightness(0.7)" />
    <ellipse cx="28" cy="42" rx="1.5" ry="1" fill={color} opacity="0.4" filter="brightness(0.7)" />
    <ellipse cx="34" cy="38" rx="1.5" ry="1.5" fill={color} opacity="0.3" filter="brightness(0.7)" />
    {/* Highlight */}
    <ellipse cx="30" cy="28" rx="8" ry="6" fill="white" opacity="0.1" />
    {/* Sprout */}
    <path d="M38 14 C40 10, 42 8, 44 10" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

export default PotatoIcon;
