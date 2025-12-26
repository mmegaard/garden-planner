"use client";
import React from "react";
import { plants } from "@/public/content/data.json";
interface PlantProps {
  /** The text to display inside the button */
  name: string;
} 

function Plant({ name }: PlantProps) {
  const currentPlant = plants.find((plant) => plant.plantId === name);
  

  return <img src={`${name}.svg`} alt={currentPlant?.displayName} style={{ pointerEvents: "none", width:"100%" }} />;
}

export default Plant;
