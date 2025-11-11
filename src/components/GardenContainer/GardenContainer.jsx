import React from "react";
import styles from "./GardenContainer.module.css";
function GardenContainer({ box, gardenArea }) {
  const width = (box.width.value / gardenArea.width.value) * 100;
  const height = (box.length.value / gardenArea.length.value) * 100;

  //should I represent all objects in some sort of inches to pixels ratio?
  //garden area width is 20, box is 5. find percentage of
  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        top: box.position.top * 100,
        left: box.position.left * 100,
        width: `${width}%`,
        height: `${height}%`,
      }}
    ></div>
  );
}

export default GardenContainer;
