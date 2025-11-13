"use client";
import * as React from "react";
import { motion } from "motion/react";
import layout from "@/public/content/boxes.json";
import GardenContainer from "../GardenContainer";
import { Button } from "@radix-ui/themes";
import { Move } from "react-feather";
import Viewport from "../../helpers/Viewport";

import styles from "./GardenArea.module.css";

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
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const { garden, boxes, defaultView } = layout;

  const [panMode, setPanMode] = React.useState(false);
  const [isPanning, setIsPanning] = React.useState(false);

  const [viewport, setViewport] = React.useState(
    new Viewport(
      defaultView.x,
      defaultView.y,
      defaultView.width,
      defaultView.height
    )
  );
  const [mouseCoord, setMouseCoord] = React.useState({ x: 0, y: 0 });
  const [clientSize, setClientSize] = React.useState({
    width: 1000,
    height: 1000,
  });

  React.useLayoutEffect(() => {
    if (constraintsRef.current) {
      // Access the div's dimensions using clientWidth, clientHeight, or getBoundingClientRect()
      setClientSize({
        width: constraintsRef.current.clientWidth,
        height: constraintsRef.current.clientHeight,
      });
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render

  React.useEffect(() => {
    function handleMouseScroll(event: WheelEvent) {
      event.preventDefault;
      const zoomSpeed = 0.001;
      const deltaY = event.deltaY;
      const zoomLevel = 1 + deltaY * zoomSpeed;
      const newViewport = viewport.zoom(zoomLevel);
      setViewport(newViewport);
    }

    constraintsRef.current?.addEventListener("wheel", handleMouseScroll);

    // Cleanup function:
    return () => {
      constraintsRef.current?.removeEventListener("wheel", handleMouseScroll);
    };
  }, [viewport]);

  function handlePanStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(true);
  }
  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    //capture end of pan and set it
    setIsPanning(false);
  }

  React.useEffect(() => {
    function handlePanMove(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.id === "world") {
        setMouseCoord({ x: event.offsetX, y: event.offsetY });
      }
      if (!isPanning) {
        return;
      }

      const xBefore = (event.offsetX - event.movementX) / clientSize.width;
      const yBefore = (event.offsetY - event.movementY) / clientSize.height;

      const xAfter = event.offsetX / clientSize.width;
      const yAfter = event.offsetY / clientSize.height;

      const beforeWorld = viewport.screenToWorld(xBefore, yBefore);
      const afterWorld = viewport.screenToWorld(xAfter, yAfter);

      const newViewport = viewport.pan(
        beforeWorld[0] - afterWorld[0],
        beforeWorld[1] - afterWorld[1]
      );
      //console.log("newX", newViewport.x);
      ///console.log("newY", newViewport.y);

      setViewport(newViewport);
    }
    constraintsRef.current?.addEventListener("mousemove", handlePanMove);

    // Cleanup function:
    return () => {
      constraintsRef.current?.removeEventListener("mousemove", handlePanMove);
    };
  }, [isPanning, viewport]);

  function handleDragEnd() {
    //get current coordinates based on absolute position from origin
    //figure out what it's overlapping with. If it's a
  }

  return (
    <div>
      <div id="debug">
        <ul>
          <li>
            Viewport top left in WORLD SPACE: {`[${viewport.x}, ${viewport.y}]`}
          </li>
          <li>
            mouse position in VIEWPORT SPACE:{" "}
            {`[${mouseCoord.x}, ${mouseCoord.y}]`}
          </li>
          <li>
            viewport width and height in WORLD SPACE:{" "}
            {`[${viewport.width}, ${viewport.height}]`}
          </li>
          <li>
            should move this much:{" "}
            {`[${viewport.x * (clientSize.height / viewport.height)}}]`}
          </li>
        </ul>
      </div>
      <motion.div
        id="viewport"
        className={styles.viewport}
        ref={constraintsRef}
        style={{
          width: `70vh`,
          height: `70vh`,
        }}
        onMouseDown={(event: React.MouseEvent<HTMLDivElement>) =>
          handlePanStart(event)
        }
        onMouseUp={(event: React.MouseEvent<HTMLDivElement>) =>
          handlePanEnd(event)
        }
        //take viewport and turn into
      >
        <div
          className={styles.world}
          id="world"
          style={{
            transform: ` translate(${
              -viewport.x * (clientSize.width / viewport.width)
            }px, ${-viewport.y * (clientSize.height / viewport.height)}px)
            scale(${clientSize.width / viewport.width},
              ${clientSize.height / viewport.height})
            `,
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
          className={styles.pan_button}
          variant="soft"
          onClick={() => setPanMode(!panMode)}
        >
          <Move />
          {panMode ? "Panning" : "Pan"}
        </Button>
      </motion.div>
    </div>
  );
}

export default GardenArea;

/*<motion.div
            className="draggable"
            drag={!panMode}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: "blue",
            }}
            dragMomentum={false}
            whileDrag={{
              scale: 1.1,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            }}
            onDragEnd={handleDragEnd}
            data-distance={30}
            onDrag={(event) => checkCollision(event)}
          /> */
