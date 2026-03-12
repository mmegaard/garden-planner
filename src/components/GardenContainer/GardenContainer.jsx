import React from "react";
import styles from "./GardenContainer.module.css";
import { useViewportContext } from "../ViewportProvider";

function GardenContainer({ box }) {
  const { viewportRef, viewport, clientSize } = useViewportContext();
  const width = box.width.value * clientSize.xScale;
  const height = box.length.value * clientSize.yScale;
  return (
    <div
      className={`${styles.gardencontainer} bounding`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
}

export default GardenContainer;
