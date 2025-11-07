"use client";
import * as React from "react";
import { motion } from "motion/react";
import layout from "@/public/content/boxes.json";
import GardenContainer from "../GardenContainer";

function checkCollision(event: Event) {
  const draggedElement: HTMLElement = event.target as HTMLElement;
  if (!draggedElement.classList.contains("draggable")) {
    return;
  }
  const draggableRect = draggedElement.getBoundingClientRect();

  //for all of the other objects have a specific class, checkem
  const otherElements: HTMLCollectionOf<Element> =
    document.getElementsByClassName("bounding");
  for (let element of otherElements) {
    const targetRect = element.getBoundingClientRect();
    /* Check for overlap on the X-axis
    const xOverlap =
      draggableRect.left < targetRect.right &&
      draggableRect.right > targetRect.left;

    // Check for overlap on the Y-axis
    const yOverlap =
      draggableRect.top < targetRect.bottom &&
      draggableRect.bottom > targetRect.top;
    */
    const fullyOverlap =
      draggableRect.left > targetRect.left &&
      draggableRect.right < targetRect.right &&
      draggableRect.top > targetRect.top &&
      draggableRect.bottom < targetRect.bottom;
    if (fullyOverlap) {
      // Collision detected!

      draggedElement.style.backgroundColor = "green"; // Example reaction

      break;
    } else {
      // No collision
      draggedElement.style.backgroundColor = "blue";
    }
  }
}

function GardenArea() {
  const { garden, boxes, viewport } = layout;
  const [zoomLevel, setZoomLevel] = React.useState(viewport["zoom-level"]);
  const [isPanning, setIsPanning] = React.useState(false);
  const [viewportPosition, setViewportPosition] = React.useState({
    x: viewport.x,
    y: viewport.y,
  });
  const constraintsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleMouseScroll(event: WheelEvent) {
      const deltaY = event.deltaY; // Vertical scroll amount

      if (deltaY < 0) {
        setZoomLevel(zoomLevel + 5);
      } else if (deltaY > 0) {
        if (zoomLevel >= 5) {
          setZoomLevel(zoomLevel - 5);
        }
      }
    }

    window.addEventListener("wheel", handleMouseScroll);

    // Cleanup function:
    return () => {
      window.removeEventListener("wheel", handleMouseScroll);
    };
  }, [zoomLevel]);

  function handlePanStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    setIsPanning(true);
  }
  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    setIsPanning(false);
  }

  React.useEffect(() => {
    function handlePanMove(event: MouseEvent) {
      if (!isPanning) {
        return;
      }

      setViewportPosition({
        x: event.movementX + viewportPosition.x,
        y: event.movementY + viewportPosition.y,
      });
    }

    window.addEventListener("mousemove", handlePanMove);
    // Cleanup function:
    return () => {
      window.removeEventListener("mousemove", handlePanMove);
    };
  }, [isPanning, viewportPosition]);

  return (
    <motion.div
      id="viewport"
      ref={constraintsRef}
      style={{
        width: `${viewport.width.value * 100}px`,
        height: `${viewport.length.value * 100}px`,
        border: "1px black solid",
        overflow: "hidden",
        position: "relative",
        margin: "auto",
      }}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) =>
        handlePanStart(event)
      }
      onMouseUp={(event: React.MouseEvent<HTMLDivElement>) =>
        handlePanEnd(event)
      }
    >
      <div
        id="world"
        style={{
          width: "inherit",
          height: "inherit",
          position: "relative",
          transformOrigin: "center center",
          transform: `scale(${zoomLevel}%) translate(${viewportPosition.x}px, ${viewportPosition.y}px)`,
        }}
      >
        {boxes.map((box, index) => {
          return (
            <GardenContainer
              box={box}
              gardenArea={garden}
              key={`${index}-${box.shape}`}
            />
          );
        })}
        <motion.div
          className="draggable"
          drag
          dragConstraints={constraintsRef}
          style={box}
          dragMomentum={false}
          whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
          data-distance={30}
          onDrag={(event) => checkCollision(event)}
        />
      </div>
    </motion.div>
  );
}

const box = {
  width: 100,
  height: 100,
  borderRadius: 10,
  backgroundColor: "blue",
};

export default GardenArea;

/*

<motion.div
      id="GardenArea"
      ref={constraintsRef}
      style={{
        width: "50vw",
        height: "90vh",
        border: "black 1px solid",
        position: "absolute",
        bottom: 0,
        left: `calc(${garden.x} + )`
      }}
    >
      {boxes.map((box, index) => {
        return (
          <GardenContainer
            box={box}
            gardenArea={garden}
            key={`${index}-${box.shape}`}
          />
        );
      })}
     
    </motion.div>


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
