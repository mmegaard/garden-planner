"use client";
import React from "react";
import { motion, MotionValue } from "motion/react";
interface DraggableProps {
  children: React.ReactNode;
  constraint?: React.RefObject<HTMLDivElement | null>;
  scale: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

function Draggable({ children, constraint, scale, x, y }: DraggableProps) {
  //if i'm inside a garden box, become part of the garden
  function checkCollision(event: DragEvent) {
    const draggedElement: HTMLElement = event.target as HTMLElement;

    if (!draggedElement?.classList?.contains("draggable")) {
    } else {
      const draggableRect = draggedElement.getBoundingClientRect();

      //for all of the other objects have a specific class, checkem
      const otherElements: HTMLCollectionOf<Element> =
        document.getElementsByClassName("bounding");
      for (let element of otherElements) {
        const targetRect = element.getBoundingClientRect();

        const fullyOverlap =
          draggableRect.left > targetRect.left &&
          draggableRect.right < targetRect.right &&
          draggableRect.top > targetRect.top &&
          draggableRect.bottom < targetRect.bottom;
        if (fullyOverlap) {
          draggedElement.style.backgroundColor = "green";

          break;
        } else {
          draggedElement.style.backgroundColor = "blue";
        }
      }
    }
  }

  function handleDragEnd() {
    //get current coordinates based on absolute position from origin
    //figure out what it's overlapping with. If it's a
  }
  return (
    <motion.div
      className="draggable"
      drag
      style={{
        width: "10%",
        height: "10%",
        borderRadius: "10%",
        backgroundColor: "blue",
        zIndex: 1,
        x,
        y,
      }}
      onDrag={(event: DragEvent, info) => {
        x.set(info.offset.x / scale);
        y.set(info.offset.y / scale);
        checkCollision(event);
      }}
      dragMomentum={false}
      whileDrag={{
        scale: 1.1,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default Draggable;

/*<div
      onMouseEnter={() => handleHover()}
      onFocus={() => handleHover()}
      onMouseLeave={() => handleHover()}
      onBlur={() => handleHover()}
      data-width={plant.planting.fromSeed.outdoor.spacingBetweenPlants.minVal}
    ></div> 
    
    <motion.div
      className="draggable"
      drag
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "10%",
        height: "10%",
        borderRadius: "10%",
        backgroundColor: "blue",
        zIndex: 1,
      }}
      dragMomentum={false}
      whileDrag={{
        scale: 1.1,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      }}
      onDragEnd={handleDragEnd}
      onDrag={(event: DragEvent) => checkCollision(event)}
    >
      {children}
    </motion.div>
    
    
    */
