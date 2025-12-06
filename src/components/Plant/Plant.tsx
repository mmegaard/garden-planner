"use client";
import React from "react";
import marigold from "@/public/marigold.svg";
import roma from "@/public/roma-tomato.svg";
import { plants } from "@/public/content/data.json";
interface PlantProps {
  /** The text to display inside the button */
  name: string;
}

function Plant({ name }: PlantProps) {
  const [iconUrl, setIconUrl] = React.useState("");
  //console.log(plants);
  const currentPlant = plants.find((plant) => plant.plantId === name);
  function checkCollision() {
    //I have x,y, and radius.
    //store positions of objects in memory
    //for all of the other objects have a specific class, checkem
    const otherElements: HTMLCollectionOf<Element> =
      document.getElementsByClassName("bounding");

    for (let element of otherElements) {
      const targetRect = element.getBoundingClientRect();
      const fullyOverlap = false;
      if (fullyOverlap) {
        //setValidity(COLORS.green.value);
        break;
      } else {
        //setValidity(COLORS.yellow.value);
      }
    }
  }

  return <img src={`${name}.svg`} style={{ pointerEvents: "none" }} />;
}

export default Plant;
