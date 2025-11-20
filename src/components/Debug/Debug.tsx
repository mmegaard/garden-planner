import React from "react";

function Debug({}) {
  return (
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
        <li>mouse position in VIEWPORT SPACE: {`[${mouseX}, ${mouseY}]`}</li>
      </ul>
    </div>
  );
*/
