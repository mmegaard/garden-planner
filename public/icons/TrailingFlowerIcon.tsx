import React from "react";
import { PlantSvgProps } from "./types";

const TrailingFlowerIcon: React.FC<PlantSvgProps> = ({
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
    {/* Trailing vine */}
    <path
      d="M12 20 C18 16, 28 20, 32 28 C36 36, 44 42, 52 38"
      stroke={accentColor}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Secondary vine */}
    <path
      d="M20 36 C26 34, 34 38, 40 48 C44 54, 50 56, 54 52"
      stroke={accentColor}
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* Leaves along vine */}
    <path d="M18 18 C14 14, 10 16, 12 20 C14 20, 16 18, 18 18Z" fill={accentColor} opacity="0.7" />
    <path d="M36 34 C34 30, 30 30, 30 34 C32 36, 34 36, 36 34Z" fill={accentColor} opacity="0.7" />
    <path d="M48 40 C50 36, 46 34, 44 38 C46 40, 48 40, 48 40Z" fill={accentColor} opacity="0.7" />
    <path d="M30 42 C28 38, 24 38, 24 42 C26 44, 28 44, 30 42Z" fill={accentColor} opacity="0.6" />
    {/* Flowers */}
    {/* Flower 1 */}
    <circle cx="22" cy="20" r="3" fill={color} opacity="0.7" />
    <circle cx="20" cy="18" r="3" fill={color} opacity="0.8" />
    <circle cx="24" cy="18" r="3" fill={color} />
    <circle cx="22" cy="16" r="2.5" fill={color} />
    {/* Flower 2 */}
    <circle cx="42" cy="44" r="3.5" fill={color} opacity="0.7" />
    <circle cx="40" cy="42" r="3.5" fill={color} opacity="0.8" />
    <circle cx="44" cy="42" r="3.5" fill={color} />
    <circle cx="42" cy="40" r="3" fill={color} />
    {/* Flower 3 (smaller, bud) */}
    <circle cx="50" cy="36" r="2.5" fill={color} opacity="0.6" />
    <circle cx="52" cy="34" r="2" fill={color} opacity="0.7" />
  </svg>
);

export default TrailingFlowerIcon;
