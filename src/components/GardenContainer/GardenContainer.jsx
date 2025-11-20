import React from "react";
import styles from "./GardenContainer.module.css";
function GardenContainer({ box }) {
  const width = box.width.value;
  const height = box.length.value;

  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        top: `${box.position.top * 10}%`,
        left: `${box.position.left * 10}%`,
        width: `${width * 10}%`,
        height: `${height * 10}%`,
      }}
    ></div>
  );
}

export default GardenContainer;
