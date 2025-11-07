import React from "react";
import data from "@/public/content/data.json";
import Plant from "../Plant";
function PlantLibrary() {
  console.log(data);
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
        return <Plant key={plant.plantId} plant={plant} />;
      })}
    </div>
  );
}

export default PlantLibrary;
