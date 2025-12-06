"use client";
import React, { RefObject } from "react";
import { motion, useMotionValue } from "motion/react";
import { useViewportContext } from "../ViewportProvider";
import styles from "./Draggable.module.css";

interface DraggableProps {
  children: React.ReactNode;
  constraint?: React.RefObject<HTMLDivElement | null>;
  initialPosition: { x: number; y: number };
}

const COLORS = {
  green: { label: "valid", value: "hsl(118deg 100% 50%)" },
  yellow: { label: "not optimal", value: "hsl(59deg 100% 50%)" },
  red: { label: "invalid", value: "hsl(7deg 100% 50%)" },
};

function Draggable({ children, initialPosition, constraint }: DraggableProps) {
  const draggableRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const { viewportRef, viewport, clientSize } = useViewportContext();
  const [validity, setValidity] = React.useState<string>("");
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  function checkCollision() {
    //only show
    const drag = draggableRef.current?.getBoundingClientRect()!;
    //for all of the other objects have a specific class, checkem
    const otherElements: HTMLCollectionOf<Element> =
      document.getElementsByClassName("bounding");
    let isValid = true;
    for (let element of otherElements) {
      const target = element.getBoundingClientRect();
      const fullyInside =
        drag.left >= target.left &&
        drag.right <= target.right &&
        drag.top >= target.top &&
        drag.bottom <= target.bottom;

      const isColliding =
        drag.left < target.right &&
        drag.right > target.left &&
        drag.top < target.bottom &&
        drag.bottom > target.top;

      if (!fullyInside && isColliding) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      setValidity(COLORS.green.value);
    } else {
      setValidity(COLORS.yellow.value);
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rectDrag = draggableRef.current?.getBoundingClientRect()!;

    const offsetX = event.clientX - rectDrag.left;
    const offsetY = event.clientY - rectDrag.top;
    setOffset({ x: offsetX, y: offsetY });
    checkCollision();
  }
  function handlePointerMove(event: React.PointerEvent) {
    if (isDragging) {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      checkCollision();
      //mouse position relative to viewport
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const x = mouseX - offset.x;
      const y = mouseY - offset.y;
      const worldCoords = viewport.screenToWorld(
        x / clientSize.width,
        y / clientSize.height
      );
      setPosition({
        x: worldCoords[0],
        y: worldCoords[1],
      });
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
        borderRadius: "100%",
        backgroundColor: isDragging ? validity : "",
        opacity: isDragging ? ".5" : "1",
        zIndex: 1,
        position: "absolute",
        left: position.x * clientSize.xScale,
        top: position.y * clientSize.yScale,
        transform: isDragging ? "scale(1.1)" : "scale(1)",
        boxShadow: isDragging ? "0px 10px 20px rgba(0,0,0,0.2)" : "none",
        touchAction: "none",
        color: "white",
      }}
    >
      {children}
    </div>
  );
}

export default Draggable;

/*
const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
    };
    img.src = "/cat.jpg";
  }, []);






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
