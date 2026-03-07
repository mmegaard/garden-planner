"use client";
import React, { useEffect } from "react";
import data from "@/public/content/data.json";
import PlantIcon from "../PlantIcon";
import { PlantItem, PlantLibraryItem } from "../../helpers/PlantClasses";
import { useObjectContext } from "../ObjectProvider";
import { MousePointer } from "react-feather";

function PlantLibrary() {
  const { currentTool, setCurrentTool } = useObjectContext();
  function handlePointerDown(event: React.PointerEvent, plantId: string) {
    const newTool = plantId;
    setCurrentTool(newTool);
  }
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCurrentTool("none");
      }
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);
  const plants = PlantLibraryItem.fromJsonArray(
    data.plants as PlantLibraryItem[],
  );
  return (
    <div
      id="plantLibraryContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        userSelect: "none",
        overflow: "scroll",
        height: "100vh",
      }}
    >
      <div
        key={"pointericon"}
        onPointerDown={(event) => handlePointerDown(event, "none")}
        className="toolSelector"
        style={{
          padding: "20%",
          width: "100px",
          height: "100px",
          borderRadius: "20%",
          backgroundColor: currentTool === "none" ? "#acfda0" : "",
        }}
      >
        <MousePointer width={"100%"} height={"100%"} />
      </div>
      {plants.map((plant: PlantLibraryItem) => {
        //if clicked, make a draggable copy of the plant
        return (
          <div
            key={plant?.scientificName}
            onPointerDown={(event) => handlePointerDown(event, plant.plantId)}
            className="toolSelector"
            title={plant.displayName}
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: currentTool === plant.plantId ? "#acfda0" : "",
              borderRadius: "20%",
            }}
          >
            <PlantIcon icon={plant.icon} baseSize={48} />
          </div>
        );
      })}
    </div>
  );
}

export default PlantLibrary;
