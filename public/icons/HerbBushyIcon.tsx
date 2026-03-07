import React from "react";
import { PlantSvgProps } from "./types";

const HerbBushyIcon: React.FC<PlantSvgProps> = ({
  color,
  accentColor = "#93C5FD",
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
    {/* Pot / ground line */}
    <path d="M20 56 L44 56" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    {/* Stems */}
    <path d="M28 56 L26 40" stroke={color} strokeWidth="1.5" opacity="0.4" filter="brightness(0.7)" />
    <path d="M32 56 L32 36" stroke={color} strokeWidth="1.5" opacity="0.4" filter="brightness(0.7)" />
    <path d="M36 56 L38 40" stroke={color} strokeWidth="1.5" opacity="0.4" filter="brightness(0.7)" />
    {/* Bush mass - overlapping rounded shapes */}
    <ellipse cx="22" cy="38" rx="12" ry="14" fill={color} opacity="0.7" />
    <ellipse cx="42" cy="38" rx="12" ry="14" fill={color} opacity="0.7" />
    <ellipse cx="32" cy="34" rx="14" ry="16" fill={color} />
    <ellipse cx="26" cy="28" rx="10" ry="10" fill={color} opacity="0.85" />
    <ellipse cx="38" cy="28" rx="10" ry="10" fill={color} opacity="0.85" />
    <ellipse cx="32" cy="22" rx="8" ry="8" fill={color} opacity="0.75" />
    {/* Flower spikes (accent) */}
    <circle cx="20" cy="24" r="2.5" fill={accentColor} opacity="0.7" />
    <circle cx="32" cy="16" r="2.5" fill={accentColor} opacity="0.7" />
    <circle cx="44" cy="24" r="2.5" fill={accentColor} opacity="0.7" />
    <circle cx="26" cy="20" r="2" fill={accentColor} opacity="0.5" />
    <circle cx="38" cy="18" r="2" fill={accentColor} opacity="0.5" />
  </svg>
);

export default HerbBushyIcon;
