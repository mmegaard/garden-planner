import { useState, useRef, useEffect } from "react";
import { useViewportContext } from "../ViewportProvider";

function DraggableComponent() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: null, y: null });
  const { viewportRef, viewport, clientSize } = useViewportContext();
  const draggableRef = useRef(null);

  //when a drag starts, set some state.
  // when a drag ends, end image state.
  //when a
  const handleDragStart = (e) => {
    // Store the offset between mouse and component position
    const rectDrag = draggableRef.current?.getBoundingClientRect();
    const offsetX = e.clientX - rectDrag.x;
    const offsetY = e.clientY - rectDrag.y;
    dragOffsetRef.current = { x: offsetX, y: offsetY };

    //Create a transparent drag image to hide the default ghost image
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrag = (event) => {
    // e.clientX and e.clientY are 0 on the final drag event, so we ignore those
    const rect = viewportRef.current.getBoundingClientRect();
    if (event.clientX === 0 && event.clientY === 0) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const x = mouseX - dragOffsetRef.current.x;
    const y = mouseY - dragOffsetRef.current.y;

    const worldCoords = viewport.screenToWorld(
      x / clientSize.width,
      y / clientSize.height
    );
    setPosition({
      x: worldCoords[0] * clientSize.xScale,
      y: worldCoords[1] * clientSize.xScale,
    });
  };

  const handleDragEnd = (event) => {
    const rect = viewportRef.current.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const x = mouseX - dragOffsetRef.current.x;
    const y = mouseY - dragOffsetRef.current.y;
    const worldCoords = viewport.screenToWorld(
      x / clientSize.width,
      y / clientSize.height
    );
    setPosition({
      x: worldCoords[0],
      y: worldCoords[1],
    });
    dragOffsetRef.current = {
      x: null,
      y: null,
    };
  };

  return (
    <div className="fixed inset-0">
      <img
        ref={draggableRef}
        className="absolute"
        draggable="true"
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        src={`roma-tomato.svg`}
        style={{
          left: `${position.x * clientSize.xScale}px`,
          top: `${position.y * clientSize.yScale}px`,
          width: "100px",
          height: "100px",
          cursor: dragOffsetRef.current.x === null ? "grab" : "grabbing",
        }}
      />
    </div>
  );
}

export default DraggableComponent;
