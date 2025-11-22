"use client";
import React, { RefObject } from "react";
import { motion, useMotionValue } from "motion/react";
import { useViewportContext } from "../ViewportProvider";
import styles from "./Draggable.module.css";

interface DraggableProps {
  children: React.ReactNode;
  constraint?: React.RefObject<HTMLDivElement | null>;
}

const COLORS = {
  green: { label: "valid", value: "hsl(118deg 100% 50%)" },
  yellow: { label: "not optimal", value: "hsl(59deg 100% 50%)" },
  red: { label: "invalid", value: "hsl(7deg 100% 50%)" },
};

function Draggable({ children, constraint }: DraggableProps) {
  const draggableRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 1, y: 1 });
  const [isDragging, setIsDragging] = React.useState(false);
  const { viewportRef, viewport, clientSize, worldRef } = useViewportContext();
  const [worldPos, setWorldPos] = React.useState({ x: 0, y: 0 });
  const [validity, setValidity] = React.useState<string>("");
  function checkCollision() {
    const draggableRect = draggableRef.current?.getBoundingClientRect()!;
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
        setValidity(COLORS.green.value);
      } else {
        setValidity(COLORS.yellow.value);
      }
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    checkCollision();
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (isDragging) {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      const rectDrag = draggableRef.current?.getBoundingClientRect()!;
      checkCollision();
      if (rect) {
        const x = Math.floor(event.clientX - rect.left);
        const y = Math.floor(event.clientY - rect.top);
        //figure out difference between clientWidth and viewPortWidth
        const clientViewportSpaceWidth = clientSize.xScale * viewport.width;
        const clientViewportSpaceHeight = clientSize.yScale * viewport.height;

        const viewX = x * (clientViewportSpaceWidth / clientSize.width);
        const viewY = y * (clientViewportSpaceHeight / clientSize.height);

        const worldCoords = viewport.screenToWorld(
          viewX / clientViewportSpaceWidth,
          viewY / clientViewportSpaceHeight
        );
        setWorldPos({
          x: worldCoords[0] * (clientSize.width / viewport.width),
          y: worldCoords[1] * (clientSize.height / viewport.height),
        });

        setPosition({
          x: worldCoords[0] * clientSize.xScale,
          y: worldCoords[1] * clientSize.yScale,
        });
      }
    }
  }

  function handlePointerUp(event: React.PointerEvent) {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      ref={draggableRef}
      className={styles.draggable}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: "10%",
        height: "10%",
        borderRadius: "10%",
        backgroundColor: isDragging ? validity : "blue",
        zIndex: 1,
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: isDragging ? "scale(1.1)" : "scale(1)",
        boxShadow: isDragging ? "0px 10px 20px rgba(0,0,0,0.2)" : "none",
        touchAction: "none",
        color: "white",
      }}
    >
      <div>{children}</div>
    </div>
  );
}

export default Draggable;

/*

function Draggable({ children, constraint, scale }: DraggableProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  console.log(scale);
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
        position: "absolute",
        x,
        y,
      }}
      onDrag={(event: DragEvent, info) => {
        //console.log(info);

        x.set(x.get() + info.delta.x / scale);
        y.set(y.get() + info.delta.y / scale);
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


<div
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
