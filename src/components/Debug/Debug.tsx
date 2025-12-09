"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";

function Debug({}) {
  const { viewportRef, viewport, clientSize } = useViewportContext();
  const [mouseCoord, setMouseCoord] = React.useState({
    x: 0,
    y: 0,
    viewX: 0,
    viewY: 0,
    worldX: 0,
    worldY: 0,
  });
  React.useEffect(() => {
    function handleMouseMove(event: PointerEvent) {
      const rect = viewportRef.current?.getBoundingClientRect();
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

        setMouseCoord({
          x: Math.floor(worldCoords[0] * (clientSize.width / viewport.width)),
          y: Math.floor(worldCoords[1] * (clientSize.height / viewport.height)),
          viewX: Math.floor(worldCoords[0] * clientSize.xScale),
          viewY: Math.floor(worldCoords[1] * clientSize.yScale),
          worldX: Math.floor(worldCoords[0]),
          worldY: Math.floor(worldCoords[1]),
        });
      }
    }

    document.addEventListener("pointermove", handleMouseMove);

    // Cleanup function:
    return () => {
      document.removeEventListener("pointermove", handleMouseMove);
    };
  }, [viewport, clientSize]);
  return (
    <div id="debug">
      <ul>
        <li>
          viewport container width and height in PIXEL SPACE:{" "}
          {`[${clientSize.width}, ${clientSize.height}]`}
        </li>
        <li>
          width and height scaled from world:{" "}
          {`[${clientSize.xScale * viewport.width}, ${
            clientSize.yScale * viewport.height
          }]`}
        </li>
        <li>
          viewport width and height in WORLD SPACE:{" "}
          {`[${viewport.width}, ${viewport.height}]`}
        </li>

        <li>
          mouse position in PIXEL SPACE: {`[${mouseCoord.x}, ${mouseCoord.y}]`}
        </li>
        <li>
          mouse position scaled from world:{" "}
          {`[${mouseCoord.viewX}, ${mouseCoord.viewY}]`}
        </li>
        <li>
          mouse position in world SPACE:{" "}
          {`[${mouseCoord.worldX}, ${mouseCoord.worldY}]`}
        </li>
        <li>scale {clientSize.width / viewport.width / clientSize.xScale}</li>
      </ul>
    </div>
  );
}

export default Debug;

/*
import React from "react";
interface DebugProps {
  The text to display inside the button 
  mouseX: number;
  mouseY: number;
}
function Debug({ mouseX, mouseY }: DebugProps) {
  return (
    <div id="debug">
      <ul>
                <li>
          Viewport top left in WORLD SPACE: {`[${viewport.x}, ${viewport.y}]`}
        </li>
        <li>
          should move this much:{" "}
          {`[${viewport.x * (clientSize.height / viewport.height)}}]`}
        </li>
      </ul>
    </div>
  );
*/
