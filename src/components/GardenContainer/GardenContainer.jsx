import React from "react";
import styles from "./GardenContainer.module.css";
import { useViewportContext } from "../ViewportProvider";

function GardenContainer({ box }) {
  const width = box.width.value;
  const height = box.length.value;
  const { viewportRef, viewport, clientSize } =
    useViewportContext();
  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        top: `${box.position.top * clientSize.xScale}px`,
        left: `${box.position.left * clientSize.yScale}px`,
        width: `${width * clientSize.xScale}px`,
        height: `${height * clientSize.yScale}px`,
      }}
    ></div>
  );
}

export default GardenContainer;
