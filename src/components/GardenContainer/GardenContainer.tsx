import React from "react";
import styles from "./GardenContainer.module.css";

interface ContainerProps {
  width: number;
  length: number;
  editable: boolean;
}

function GardenContainer({ width, length, editable }: ContainerProps) {
  //if editable is true, and it is selected
  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        width: `${length}px`,
        height: `${width}px`,
      }}
    ></div>
  );
}

export default GardenContainer;
