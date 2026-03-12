"use client";
import * as React from "react";
import { motion, useMotionValue } from "motion/react";
import GardenContainer from "../GardenContainer";
import { Button } from "@radix-ui/themes";
import { Move } from "react-feather";
import Viewport from "../../helpers/Viewport";
import styles from "./GardenArea.module.css";
import Draggable from "../Draggable";
import { useViewportContext } from "../ViewportProvider";
import { useObjectContext } from "../ObjectProvider";
import {
  PlantLibraryItem,
  PlantLibraryItemJson,
  PlantItem,
} from "@/src/helpers/PlantClasses";
import CurrentTool from "../CurrentTool/CurrentTool";
import data from "../../../public/content/data.json";
import Plant from "../Plant";
function GardenArea() {
  const { viewportRef, setIsPanning, viewport, clientSize, worldRef } =
    useViewportContext();
  const { plants, setPlants, currentTool, boxes, setBoxPosition } = useObjectContext();
  const [panMode, setPanMode] = React.useState(false);

  function handlePanStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(true);
  }

  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(false);
  }

  function findContainerAtPosition(x: number, y: number) {
    return boxes.find(
      (box) =>
        x >= box.position.x &&
        x <= box.position.x + box.width.value &&
        y >= box.position.y &&
        y <= box.position.y + box.length.value,
    ) ?? null;
  }

  function handleSetPlantPosition(id: number, x: number, y: number) {
    const container = findContainerAtPosition(x, y);
    const newPlants = plants.map((pl) =>
      pl.id !== id
        ? pl
        : PlantItem.fromJson({
            ...pl,
            boxId: container?.id,
            position: container
              ? { x: x - container.position.x, y: y - container.position.y }
              : { x, y },
          }),
    );
    setPlants(newPlants);
  }

  function handleSetBoxPosition(id: number, x: number, y: number) {
    setBoxPosition(id, x, y);
  }
  const plantLibraryMap = new Map(
    PlantLibraryItem.fromJsonArray(data.plants as PlantLibraryItemJson[]).map(
      (p) => [p.plantId, p],
    ),
  );
  return (
    <div style={{ display: "inline-block" }}>
      <div
        id="viewport"
        className={styles.viewport}
        ref={viewportRef}
        onMouseDown={(event: React.MouseEvent<HTMLDivElement>) =>
          handlePanStart(event)
        }
        onMouseUp={(event: React.MouseEvent<HTMLDivElement>) =>
          handlePanEnd(event)
        }
      >
        <div
          className={styles.world}
          id="world"
          ref={worldRef}
          style={{
            transform: `translate(${
              -viewport.x * (clientSize.width / viewport.width)
            }px, ${-viewport.y * (clientSize.height / viewport.height)}px)
            scale(${clientSize.width / viewport.width / clientSize.xScale}, ${
              clientSize.height / viewport.height / clientSize.yScale
            })
            `,
          }}
        >
          {boxes.map((box, index) => (
            <Draggable
              key={`${index}-${box.shape}`}
              id={box.id}
              initialPosition={{ x: box.position.x, y: box.position.y }}
              setObjectPosition={handleSetBoxPosition}
              type="container"
              shape={box.shape}
            >
              <GardenContainer box={box} />
            </Draggable>
          ))}
          {plants.map((planted: PlantItem, index) => {
            const libraryItem = plantLibraryMap.get(planted.name);
            const container = planted.boxId
              ? boxes.find((b) => b.id === planted.boxId)
              : null;
            const initialPosition = container
              ? {
                  x: container.position.x + planted.position.x,
                  y: container.position.y + planted.position.y,
                }
              : planted.position;
            return (
              <Draggable
                initialPosition={initialPosition}
                key={`${index}-${planted.name}`}
                setObjectPosition={handleSetPlantPosition}
                id={planted.id}
                type="plant"
                shape={"circle"}
                className={styles.planted}
              >
                {libraryItem && (
                  <Plant plant={libraryItem} icon={libraryItem.icon} />
                )}
              </Draggable>
            );
          })}
        </div>
        {currentTool !== "none" && <CurrentTool tool={currentTool} />}

        <Button
          className={styles.pan_button}
          variant="soft"
          onClick={() => setPanMode(!panMode)}
        >
          <Move />
          {panMode ? "Panning" : "Pan"}
        </Button>
      </div>
    </div>
  );
}

export default GardenArea;
