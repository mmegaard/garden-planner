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
  /** The text to display inside the button */
  plant: PlantLibraryItem;
  icon: PlantIconConfig;
}

function Plant({ plant, icon }: PlantProps) {
  //TODO: give the plant a size based on it's attributes from plant. It will drive the collision stuff in draggable.
  const { clientSize } = useViewportContext();
  const diameterInFeet =
    plant.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12;
  const width = diameterInFeet * clientSize.xScale;
  const height = diameterInFeet * clientSize.yScale;
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
      <PlantIcon icon={icon} baseSize={48} />
    </div>
  );
}

export default Plant;
