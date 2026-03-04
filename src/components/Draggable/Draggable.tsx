"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";
import styles from "./Draggable.module.css";
import { useObjectContext } from "../ObjectProvider";
import PlantItem from "@/src/helpers/PlantItem";
interface DraggableProps {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  setObjectPosition: (id: number, x: number, y: number) => void;
  id: number;
  className?: string;
  dragging?: boolean;
}

const COLORS = {
  green: { label: "valid", value: "hsl(118deg 100% 50%)" },
  yellow: { label: "not optimal", value: "hsl(59deg 100% 50%)" },
  red: { label: "invalid", value: "hsl(7deg 100% 50%)" },
};

function Draggable({
  children,
  initialPosition,
  setObjectPosition,
  id,
  className,
  dragging,
}: DraggableProps) {
  const draggableRef = React.useRef<HTMLDivElement>(null);
  const [dragPosition, setDragPosition] = React.useState({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [isDragging, setIsDragging] = React.useState(dragging || false);
  const { viewportRef, viewport, clientSize } = useViewportContext();
  const [validity, setValidity] = React.useState<string>("");
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  function checkCollision() {
    const drag = draggableRef.current?.getBoundingClientRect()!;
    //for all of the other objects have a specific class, checkem
    const containers: HTMLCollectionOf<Element> =
      document.getElementsByClassName("bounding");
    for (let container of containers) {
      const target = container.getBoundingClientRect();
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
        setValidity(COLORS.red.value);
        return;
      }
    }

    const plantedPlants: HTMLCollectionOf<Element> =
      document.getElementsByClassName("planted");

    for (let plant of plantedPlants) {
      if (plant.classList.contains("dragging")) {
        continue;
      }
      const target = plant.getBoundingClientRect();

      if (
        drag.left < target.right &&
        drag.right > target.left &&
        drag.top < target.bottom &&
        drag.bottom > target.top
      ) {
        console.log(plant);
        setValidity(COLORS.yellow.value);
        return;
      }
    }

    setValidity(COLORS.green.value);
  }

  function handlePointerDown(event: React.PointerEvent) {
    event.preventDefault();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rectDrag = draggableRef.current?.getBoundingClientRect()!;
    const offsetX = event.clientX - rectDrag.left;
    const offsetY = event.clientY - rectDrag.top;
    setOffset({ x: offsetX, y: offsetY });
  }
  function handlePointerMove(event: React.PointerEvent) {
    event.preventDefault();
    if (isDragging) {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      checkCollision();
      //mouse position relative to viewport
      const x = event.clientX - rect.left - offset.x;
      const y = event.clientY - rect.top - offset.y;
      const worldCoords = viewport.screenToWorld(
        x / clientSize.width,
        y / clientSize.height,
      );
      setDragPosition({
        x: worldCoords[0],
        y: worldCoords[1],
      });
    }
  }

  function handlePointerUp(event: React.PointerEvent) {
    event.preventDefault();
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    setObjectPosition(id, dragPosition.x, dragPosition.y);
  }
  return (
    <div
      ref={draggableRef}
      className={`${styles.draggable} planted ${isDragging && "dragging"}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "100%",
        backgroundColor: isDragging ? validity : "",
        opacity: isDragging ? ".5" : "1",
        zIndex: 1,
        position: "absolute",
        left:
          (isDragging ? dragPosition.x : initialPosition.x) * clientSize.xScale,
        top:
          (isDragging ? dragPosition.y : initialPosition.y) * clientSize.yScale,
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
