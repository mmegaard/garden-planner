import React from "react";
import { PlantSvgProps } from "./types";

const StrawberryIcon: React.FC<PlantSvgProps> = ({
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
    <line x1="32" y1="4" x2="32" y2="14" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    {/* Calyx leaves */}
    <path d="M32 14 C26 8, 18 10, 20 16 C22 14, 28 14, 32 14Z" fill={accentColor} />
    <path d="M32 14 C38 8, 46 10, 44 16 C42 14, 36 14, 32 14Z" fill={accentColor} />
    <path d="M32 14 C30 6, 26 6, 28 12" fill={accentColor} opacity="0.7" />
    <path d="M32 14 C34 6, 38 6, 36 12" fill={accentColor} opacity="0.7" />
    {/* Berry body - heart/triangle shape */}
    <path
      d="M18 18 C14 22, 12 30, 18 40 C22 48, 28 54, 32 58 C36 54, 42 48, 46 40 C52 30, 50 22, 46 18 Q40 14, 32 16 Q24 14, 18 18Z"
      fill={color}
    />
    {/* Seeds */}
    <ellipse cx="24" cy="26" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" transform="rotate(-15 24 26)" />
    <ellipse cx="32" cy="24" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" />
    <ellipse cx="40" cy="26" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" transform="rotate(15 40 26)" />
    <ellipse cx="22" cy="34" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" transform="rotate(-10 22 34)" />
    <ellipse cx="30" cy="32" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" />
    <ellipse cx="38" cy="34" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" transform="rotate(10 38 34)" />
    <ellipse cx="26" cy="42" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" />
    <ellipse cx="34" cy="40" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" />
    <ellipse cx="42" cy="42" rx="1" ry="1.5" fill="#FACC15" opacity="0.6" />
    <ellipse cx="32" cy="48" rx="1" ry="1.5" fill="#FACC15" opacity="0.5" />
    {/* Highlight */}
    <ellipse cx="26" cy="28" rx="4" ry="6" fill="white" opacity="0.12" />
  </svg>
);

export default StrawberryIcon;
