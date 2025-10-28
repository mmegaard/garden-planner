"use client";
import * as React from "react";
import { motion } from "motion/react";

function GardenGrid() {
  return (
    <>
      <motion.div
        drag
        style={box}
        dragMomentum={false}
        whileDrag={{ scale: 1.3, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      />
    </>
  );
}

const box = {
  width: 100,
  height: 100,
  backgroundColor: "#dd00ee",
  borderRadius: 10,
};

export default GardenGrid;

/*
import { useRef } from "react";

export function DragInContainer() {
  const constraintsRef = useRef(null);

  // onDragEnd provides the x and y coordinates relative to the top-left of the container
  const handleDragEnd = (event, info) => {
    const relativeX = info.point.x - constraintsRef.current.getBoundingClientRect().left;
    const relativeY = info.point.y - constraintsRef.current.getBoundingClientRect().top;
    console.log("Drag end position relative to container:", { x: relativeX, y: relativeY });
  };

  return (
    <div
      ref={constraintsRef}
      style={{
        width: 400,
        height: 400,
        background: "#eee",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        style={{
          width: 50,
          height: 50,
          background: "purple",
          borderRadius: 5,
        }}
      />
    </div>
  );
}*/
