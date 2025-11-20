"use client";
import * as React from "react";
import { motion, useMotionValue } from "motion/react";
import layout from "@/public/content/boxes.json";
import GardenContainer from "../GardenContainer";
import { Button } from "@radix-ui/themes";
import { Move } from "react-feather";
import Viewport from "../../helpers/Viewport";
import Plant from "../Plant";
import styles from "./GardenArea.module.css";
import Draggable from "../Draggable";

import { view } from "motion/react-client";
import Debug from "../Debug";
import { isFloat32Array } from "util/types";
function GardenArea() {
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const { garden, boxes, defaultView } = layout;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [panMode, setPanMode] = React.useState(false);
  const [isPanning, setIsPanning] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [viewport, setViewport] = React.useState(
    new Viewport(
      defaultView.x,
      defaultView.y,
      defaultView.width,
      defaultView.height
    )
  );
  const [mouseCoord, setMouseCoord] = React.useState({
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
  });
  const [clientSize, setClientSize] = React.useState({
    width: 100 * viewport.width,
    height: 100 * viewport.height,
    xScale: 100,
    yScale: 100,
  });

  //maybe update the useEffect to update the clientSize when a window
  React.useLayoutEffect(() => {
    if (constraintsRef.current) {
      // Access the div's dimensions using clientWidth, clientHeight, or getBoundingClientRect()
      setClientSize({
        width: constraintsRef.current.clientWidth,
        height: constraintsRef.current.clientHeight,
        xScale: constraintsRef.current.clientWidth / viewport.width,
        yScale: constraintsRef.current.clientHeight / viewport.height,
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
    function handleMouseEnter(event: MouseEvent) {
      setIsHovering(true);
    }
    function handleMouseLeave(event: MouseEvent) {
      setIsHovering(false);
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = constraintsRef.current?.getBoundingClientRect();
      if (rect) {
        const x = Math.floor(event.clientX - rect.left);
        const y = Math.floor(event.clientY - rect.top);
        const worldCoords = viewport.screenToWorld(
          x / clientSize.width,
          y / clientSize.height
        );

        setMouseCoord({
          x: x,
          y: y,
          worldX: Math.floor(worldCoords[0]),
          worldY: Math.floor(worldCoords[1]),
        });
      } else {
      }
    }

    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup function:
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseCoord]);

  React.useEffect(() => {
    function handlePanMove(event: MouseEvent) {
      if (isPanning) {
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
        setViewport(newViewport);
      }

      //console.log("newX", newViewport.x);
      ///console.log("newY", newViewport.y);
    }
    constraintsRef.current?.addEventListener("mousemove", handlePanMove);

    // Cleanup function:
    return () => {
      constraintsRef.current?.removeEventListener("mousemove", handlePanMove);
    };
  }, [isPanning, viewport]);

  function handleDrop(event: React.DragEvent) {}
  return (
    <div>
      <div id="debug">
        {" "}
        <li>
          viewport width and height in VIEWPORT SPACE:{" "}
          {`[${clientSize.xScale * viewport.width}, ${
            clientSize.yScale * viewport.height
          }]`}
        </li>
        <li>
          viewport width and height in WORLD SPACE:{" "}
          {`[${viewport.width}, ${viewport.height}]`}
        </li>
        <li>
          mouse position in VIEWPORT SPACE:{" "}
          {`[${mouseCoord.x}, ${mouseCoord.y}]`}
        </li>
        <li>
          mouse position in world SPACE:{" "}
          {`[${mouseCoord.worldX}, ${mouseCoord.worldY}]`}
        </li>
      </div>{" "}
      <motion.div
        id="viewport"
        className={styles.viewport}
        ref={constraintsRef}
        style={{
          width: `90vh`,
          height: `90vh`,
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
            transform: `translate(${
              -viewport.x * (clientSize.width / viewport.width)
            }px, ${-viewport.y * (clientSize.height / viewport.height)}px)
            scale(${clientSize.width / viewport.width / clientSize.xScale}
            `,
          }}
        >
          {boxes.map((box, index) => {
            return <GardenContainer box={box} key={`${index}-${box.shape}`} />;
          })}
          <Draggable
            scale={clientSize.width / viewport.width / clientSize.xScale}
            x={x}
            y={y}
          >
            <Plant name="tom" />
          </Draggable>
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
