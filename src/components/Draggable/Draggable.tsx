"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";
import styles from "./Draggable.module.css";
import { useObjectContext } from "../ObjectProvider";
import { WorldObject } from "@/src/helpers/PlantClasses";
interface DraggableProps {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  setObjectPosition: (id: number, x: number, y: number) => void;
  object: WorldObject;
  shape: string;
  className?: string;
  dragging?: boolean;
  enabled: boolean;
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
  object,
  shape,
  enabled,
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
    plants,
    containers: containers,
    refRegistry,
    registerRef,
    unregisterRef,
    collidingId,
    setCollidingId,
    selected,
    setSelected,
  } = useObjectContext();
  const isSelected = selected?.id === object.id;
  const pointerDownPos = React.useRef<{ x: number; y: number } | null>(null);
  const [validity, setValidity] = React.useState<string>("");
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    registerRef(object.id, draggableRef, object.type, shape);
    return () => unregisterRef(object.id, object.type);
  }, [object.id, object.type, shape]);

  React.useEffect(() => {
    if (!isDragging) {
      setDragPosition({ x: initialPosition.x, y: initialPosition.y });
    }
  }, [initialPosition.x, initialPosition.y, isDragging]);

  function checkCollision() {
    const drag = draggableRef.current?.getBoundingClientRect();
    if (!drag) return;

    let containerCollidingId: number | null = null;
    const plantCollidingIds = new Set<number>();

    for (const [
      compositeKey,
      { ref, type: otherType, shape: otherShape, id: otherId },
    ] of refRegistry.current) {
      if (compositeKey === `${object.type}-${object.id}`) continue;
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
      } else if (object.type !== "container") {
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
          isColliding =
            drag.left < target.right &&
            drag.right > target.left &&
            drag.top < target.bottom &&
            drag.bottom > target.top;
        }
        if (isColliding) {
          plantCollidingIds.add(otherId);
        }
      }
    }

    if (containerCollidingId !== null) {
      setValidity(COLORS.red.value);
      setCollidingId(plantCollidingIds);
    } else if (plantCollidingIds.size > 0) {
      setValidity(COLORS.yellow.value);
      setCollidingId(plantCollidingIds);
    } else {
      setValidity(COLORS.green.value);
      setCollidingId(new Set());
    }
  }

  function handlePointerDown(event: React.PointerEvent) {
    if (enabled) return;
    event.preventDefault();
    setDragPosition({ x: initialPosition.x, y: initialPosition.y });
    setIsDragging(true);
    checkCollision();
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
    if (enabled) return;
    event.preventDefault();
    setIsDragging(false);
    setCollidingId(new Set());
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointerDownPos.current) {
      const dx = event.clientX - pointerDownPos.current.x;
      const dy = event.clientY - pointerDownPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) {
        console.log("object is", object);
        if (object.type === "plant") {
          setSelected(plants.find((plant) => plant.id === object.id) ?? null);
        } else if (object.type === "container") {
          setSelected(
            containers.find((container) => container.id === object.id) ?? null,
          );
        }

        pointerDownPos.current = null;
        return;
      }
      pointerDownPos.current = null;
    }
    setObjectPosition(object.id, dragPosition.x, dragPosition.y);
  }

  return (
    <div
      ref={draggableRef}
      className={`${styles.draggable} planted ${
        object.type === "plant" ? "plant-type" : "container-type"
      } ${isDragging && "dragging"}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        backgroundColor: isDragging
          ? validity
          : collidingId.has(object.id)
          ? COLORS.red.value
          : "",
        opacity: isDragging || collidingId.has(object.id) ? ".5" : "1",
        borderRadius: shape === "circle" ? "50%" : "0",
        outline: isSelected ? "2px solid #4A90D9" : "none",
        outlineOffset: "2px",
        zIndex:
          object.type === "container"
            ? isSelected
              ? 1
              : 0
            : isSelected
            ? 3
            : 2,
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
