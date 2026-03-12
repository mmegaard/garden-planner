"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";
import styles from "./Draggable.module.css";
import { useObjectContext, DraggableType } from "../ObjectProvider";
interface DraggableProps {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  setObjectPosition: (id: number, x: number, y: number) => void;
  id: number;
  type: DraggableType;
  shape: string;
  className?: string;
  dragging?: boolean;
}

const COLORS = {
  green: { label: "valid", value: "hsl(118deg 100% 50%)" },
  yellow: { label: "not optimal", value: "hsl(59deg 100% 50%)" },
  red: { label: "invalid", value: "hsl(7deg 100% 50%)" },
};

/* from gamegame

const isColliding = () => {
  const platforms = platformState.platformsInRiver;
  const cursorRadius = CURSOR_SIZE / 2;
  const platformRadius = PLATFORM_SIZE / 2;
  for (const platform of platforms) {
    const distanceX =
      platformState.x + cursorRadius - (platform.x + platformRadius);
    const distanceY =
      platformState.y + cursorRadius - (platform.y + platformRadius);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < cursorRadius + platformRadius) return true;
  }
  return false;
};*/

function Draggable({
  children,
  initialPosition,
  setObjectPosition,
  id,
  type,
  shape,
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
  const {
    refRegistry,
    registerRef,
    unregisterRef,
    collidingId,
    setCollidingId,
    selected,
    setSelected,
  } = useObjectContext();
  const isSelected = selected?.id === id;
  const pointerDownPos = React.useRef<{ x: number; y: number } | null>(null);
  const [validity, setValidity] = React.useState<string>("");
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    registerRef(id, draggableRef, type, shape);
    return () => unregisterRef(id, type);
  }, [id, type, shape]);

  function checkCollision() {
    const drag = draggableRef.current?.getBoundingClientRect();
    if (!drag) return;

    let containerCollidingId: number | null = null;
    let plantCollidingId: number | null = null;

    for (const [
      compositeKey,
      { ref, type: otherType, shape: otherShape, id: otherId },
    ] of refRegistry.current) {
      if (compositeKey === `${type}-${id}`) continue;
      const target = ref.current?.getBoundingClientRect();
      if (!target) continue;

      if (otherType === "container") {
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
          containerCollidingId = otherId;
        }
      } else {
        const bothCircles = shape === "circle" && otherShape === "circle";
        let isColliding: boolean;
        if (bothCircles) {
          const cx1 = drag.left + drag.width / 2;
          const cy1 = drag.top + drag.height / 2;
          const r1 = drag.width / 2;
          const cx2 = target.left + target.width / 2;
          const cy2 = target.top + target.height / 2;
          const r2 = target.width / 2;
          const distance = Math.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2);
          isColliding = distance < r1 + r2;
        } else {
          console.log("checking collision with container");
          isColliding =
            drag.left < target.right &&
            drag.right > target.left &&
            drag.top < target.bottom &&
            drag.bottom > target.top;
        }
        if (isColliding) {
          plantCollidingId = otherId;
        }
      }
    }

    if (containerCollidingId !== null) {
      setValidity(COLORS.red.value);
      setCollidingId(plantCollidingId ?? containerCollidingId);
    } else if (plantCollidingId !== null) {
      setValidity(COLORS.yellow.value);
      setCollidingId(plantCollidingId);
    } else {
      setValidity(COLORS.green.value);
      setCollidingId(null);
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    event.preventDefault();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rectDrag = draggableRef.current?.getBoundingClientRect()!;
    const offsetX = event.clientX - rectDrag.left;
    const offsetY = event.clientY - rectDrag.top;
    setOffset({ x: offsetX, y: offsetY });
    pointerDownPos.current = { x: event.clientX, y: event.clientY };
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
    setCollidingId(null);
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointerDownPos.current) {
      const dx = event.clientX - pointerDownPos.current.x;
      const dy = event.clientY - pointerDownPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) {
        setSelected(isSelected ? null : { id, type });
        pointerDownPos.current = null;
        return;
      }
      pointerDownPos.current = null;
    }
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
        backgroundColor: isDragging
          ? validity
          : collidingId === id
          ? COLORS.red.value
          : "",
        opacity: isDragging || collidingId == id ? ".5" : "1",
        borderRadius: shape === "circle" ? "50%" : "0",
        outline: isSelected ? "2px solid #4A90D9" : "none",
        outlineOffset: "2px",
        zIndex:
          type === "container" ? (isSelected ? 1 : 0) : isSelected ? 3 : 2,
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
