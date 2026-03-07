import React from "react";
import { getIconComponent } from "../../helpers/PlantIconRegistry";
import type { PlantIconConfig } from "../../helpers/PlantClasses";

// ─── Props ───────────────────────────────────────────────────────────────────

interface PlantIconProps {
  /** The icon config from a PlantLibraryItem */
  icon: PlantIconConfig;
  /** Base pixel size before scaling is applied (default: 48) */
  baseSize?: number;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Renders the correct plant SVG based on the icon config.
 *
 * Usage:
 *   <PlantIcon icon={plant.icon} />
 *   <PlantIcon icon={plant.icon} baseSize={64} />
 *
 * The component handles three things:
 *   1. Picks the right SVG shape via the registry  (icon.base)
 *   2. Passes in the colour                        (icon.color)
 *   3. Applies the scale to the base size           (icon.scale)
 */
const PlantIcon: React.FC<PlantIconProps> = ({
  icon,
  baseSize = 48,
  className,
}) => {
  const SvgComponent = getIconComponent(icon.base);
  const scaledSize = Math.round(baseSize * icon.scale);

  return (
    <SvgComponent
      color={icon.color}
      accentColor={icon.accentColor}
      size={scaledSize}
      className={className}
    />
  );
};

export default PlantIcon;
