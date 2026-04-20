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
import { PLANT_SVG_MAX_PX } from "@/src/helpers/containment";
interface PlantProps {
  /** The text to display inside the button */
  plant: PlantLibraryItem;
  icon: PlantIconConfig;
  displaySize?: number;
}

function Plant({ plant, icon, displaySize }: PlantProps) {
  //TODO: give the plant a size based on it's attributes from plant. It will drive the collision stuff in draggable.
  const { clientSize } = useViewportContext();
  const diameterInFeet =
    plant.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12;
  const width = displaySize ?? diameterInFeet * clientSize.xScale;
  const height = displaySize ?? diameterInFeet * clientSize.yScale;
  const iconSize = displaySize ? width : Math.min(width, PLANT_SVG_MAX_PX);
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
