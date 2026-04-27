"use client";
import React from "react";
import { plants } from "@/public/content/data.json";
import PlantIcon from "../PlantIcon";
import { useViewportContext } from "../ViewportProvider";
import {
  PlantItem,
  PlantIconConfig,
  PlantLibraryItem,
} from "@/src/helpers/PlantClasses";
interface PlantProps {
  plant: PlantLibraryItem;
  icon: PlantIconConfig;
  displaySize?: number;
}

function Plant({ plant, icon, displaySize }: PlantProps) {
  const { clientSize } = useViewportContext();
  const diameterInFeet =
    plant.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12;
  const width = displaySize ?? diameterInFeet * clientSize.xScale;
  const height = displaySize ?? diameterInFeet * clientSize.yScale;
  const iconSize = displaySize ? width : Math.min(width, 80);
  const baseSize = Math.round(iconSize / icon.scale);

  return (
    <div
      style={{
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PlantIcon icon={icon} baseSize={baseSize} />
    </div>
  );
}

export default Plant;
