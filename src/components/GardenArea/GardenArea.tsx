"use client";
import * as React from "react";
import { motion } from "motion/react";
import layout from "@/public/content/boxes.json";
import GardenContainer from "../GardenContainer";
import { Button } from "@radix-ui/themes";
import { Move } from "react-feather";
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
  const [panMode, setPanMode] = React.useState(false);
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
    if (event.button !== 0 || !panMode) return;
    setIsPanning(true);
    //capture start of pan
    const newX = event.movementX + viewportPosition.x;
    const newY = event.movementY + viewportPosition.y;
    setViewportPosition({
      x: newX,
      y: newY,
    });
  }
  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    //capture end of pan and set it
    const newX = event.movementX + viewportPosition.x;
    const newY = event.movementY + viewportPosition.y;
    setViewportPosition({
      x: newX,
      y: newY,
    });
    setIsPanning(false);
  }

  React.useEffect(() => {
    function handlePanMove(event: MouseEvent) {
      if (!isPanning) {
        return;
      }
      const newX = event.movementX + viewportPosition.x;
      const newY = event.movementY + viewportPosition.y;
      setViewportPosition({
        x: newX,
        y: newY,
      });
    }

    window.addEventListener("mousemove", handlePanMove);
    // Cleanup function:
    return () => {
      window.removeEventListener("mousemove", handlePanMove);
    };
  }, [isPanning, viewportPosition]);

  function handleDragEnd() {
    //get current coordinates based on absolute position from origin
    //figure out what it's overlapping with. If it's a
  }

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
      </div>
      <Button
        className="inline-block"
        variant="soft"
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => setPanMode(!panMode)}
      >
        <Move />
        {panMode ? "Panning" : "Pan"}
      </Button>
      {!panMode && (
        <motion.div
          className="draggable"
          drag
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            backgroundColor: "blue",
          }}
          dragMomentum={false}
          whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
          onDragEnd={handleDragEnd}
          data-distance={30}
          onDrag={(event) => checkCollision(event)}
        ></motion.div>
      )}
    </motion.div>
  );
}

export default GardenArea;
