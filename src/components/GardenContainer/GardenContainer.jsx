import React from "react";
import styles from "./GardenContainer.module.css";
function GardenContainer({ box, gardenArea }) {
  const width = box.width.value;
  const height = box.length.value;

  //should I represent all objects in some sort of inches to pixels ratio?
  //garden area width is 20, box is 5. find percentage of
  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        top: box.position.top,
        left: box.position.left,
        width,
        height,
      }}
    ></div>
  );
}

export default GardenContainer;
