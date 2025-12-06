"use client";
import React from "react";
import data from "@/public/content/data.json";
import Plant from "../Plant";
function PlantLibrary() {
  function handlePointerDown(event: React.PointerEvent) {
    console.log(event.currentTarget);
    //get child
    //clone child with draggable component on it
  }

  return (
    <div
      id="plantLibraryContainer"
      style={{
        width: "5vw",
        height: "50vh",
        border: "black 1px solid",
        display: "inline-block",
      }}
    >
      {data.plants.map((plant) => {
        //console.log(plant);
        //if clicked, make a draggable copy of the plant
        return (
          <div onPointerDown={handlePointerDown}>
            <Plant key={plant.plantId} name={plant.plantId} />
          </div>
        );
      })}
    </div>
  );
}

export default PlantLibrary;
