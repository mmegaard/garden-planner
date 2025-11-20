"use client";
import React from "react";
interface PlantProps {
  /** The text to display inside the button */
  name: string;
}

function Plant({ name }: PlantProps) {
  //console.log(plant.planting.fromSeed.outdoor.spacingBetweenPlants);
  function handleOnDrag(event: React.DragEvent) {}
  return <div></div>;
}

export default Plant;
