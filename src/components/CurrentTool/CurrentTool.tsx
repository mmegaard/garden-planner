"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";
import { useObjectContext } from "../ObjectProvider";
import Plant from "../Plant";
import { PlantLibraryItem, PlantLibraryItemJson } from "@/src/helpers/PlantClasses";
import data from "@/public/content/data.json";

const plantLibraryMap = new Map(
  PlantLibraryItem.fromJsonArray(data.plants as PlantLibraryItemJson[]).map((p) => [p.plantId, p])
);

interface CurrentToolProps {
  tool: string;
}

function CurrentTool({ tool }: CurrentToolProps) {
  const { currentTool, toolPosition } = useObjectContext();
  const { clientSize, viewport } = useViewportContext();
  const scale = clientSize.width / viewport.width;

  const libraryItem = plantLibraryMap.get(currentTool);
  if (!libraryItem) return null;

  const diameterFeet = libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12;
  const displaySize = diameterFeet * scale;
  const imgX = (toolPosition.x - viewport.x) * scale - displaySize / 2;
  const imgY = (toolPosition.y - viewport.y) * scale - displaySize / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: imgX,
        top: imgY,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    >
      <Plant plant={libraryItem} icon={libraryItem.icon} displaySize={displaySize} />
    </div>
  );
}

export default CurrentTool;