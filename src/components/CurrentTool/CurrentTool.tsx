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

  if (currentTool === "add-container") {
    const boxPx = 1 * scale;
    const boxX = (toolPosition.x - viewport.x) * scale - boxPx / 2;
    const boxY = (toolPosition.y - viewport.y) * scale - boxPx / 2;
    return (
      <div
        style={{
          position: "absolute",
          left: boxX,
          top: boxY,
          width: boxPx,
          height: boxPx,
          backgroundColor: "lch(28.39% 34.86 67.29)",
          border: "4px solid rgb(172, 107, 33)",
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
    );
  }

  const libraryItem = plantLibraryMap.get(currentTool);
  if (!libraryItem) return null;

  const diameterFeet = libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12;
  const iconSize = Math.min(diameterFeet * clientSize.xScale, 80) * scale / clientSize.xScale;
  const imgX = (toolPosition.x - viewport.x) * scale - iconSize / 2;
  const imgY = (toolPosition.y - viewport.y) * scale - iconSize / 2;

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
      <Plant plant={libraryItem} icon={libraryItem.icon} displaySize={iconSize} />
    </div>
  );
}

export default CurrentTool;