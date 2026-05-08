"use client";
import React from "react";
import PlantIcon from "../PlantIcon";
import { useViewportContext } from "../ViewportProvider";
import {
  PlantIconConfig,
  PlantLibraryItem,
} from "@/src/helpers/PlantClasses";
import styles from "./PlantLabel.module.css";

interface PlantLabelProps {
  plant: PlantLibraryItem;
  icon: PlantIconConfig;
  displaySize?: number;
  hideRadius?: boolean;
}

function PlantLabel({ plant, icon, displaySize, hideRadius }: PlantLabelProps) {
  const { clientSize } = useViewportContext();
  const diameterInFeet =
    plant.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12;
  const width = displaySize ?? diameterInFeet * clientSize.xScale;
  const height = displaySize ?? diameterInFeet * clientSize.yScale;
  const iconBase = 18;

  const footprintStyle: React.CSSProperties = { width, height };
  if (hideRadius) {
    footprintStyle.background = "transparent";
    footprintStyle.border = "none";
  }

  return (
    <div className={styles.footprint} style={footprintStyle}>
      <svg
        className={styles.dicot}
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <path
          d="M12 22 L12 12"
          stroke="#3f7a35"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse
          cx="7"
          cy="9"
          rx="5.5"
          ry="3.2"
          fill="#5fb353"
          transform="rotate(-25 7 9)"
        />
        <ellipse
          cx="17"
          cy="9"
          rx="5.5"
          ry="3.2"
          fill="#5fb353"
          transform="rotate(25 17 9)"
        />
        <path
          d="M7 9 L11 11"
          stroke="#3f7a35"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M17 9 L13 11"
          stroke="#3f7a35"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      <div className={styles.label}>
        <PlantIcon icon={icon} baseSize={Math.round(iconBase / icon.scale)} />
        <span className={styles.name}>{plant.displayName}</span>
      </div>
    </div>
  );
}

export default PlantLabel;
