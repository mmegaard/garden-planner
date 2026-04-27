import React from "react";
import styles from "./GardenContainer.module.css";

interface ContainerProps {
  width: number;
  length: number;
  editable: boolean;
  shape?: string;
}

function GardenContainer({ width, length, editable, shape }: ContainerProps) {
  //if editable is true, and it is selected
  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        width: `${length}px`,
        height: `${width}px`,
        borderRadius: shape === "circle" ? "50%" : "0",
      }}
    ></div>
  );
}

export default GardenContainer;
