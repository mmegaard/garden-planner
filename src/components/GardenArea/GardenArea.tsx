"use client";
import * as React from "react";
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
  Container,
} from "@/src/helpers/PlantClasses";
import CurrentTool from "../CurrentTool/CurrentTool";
import data from "../../../public/content/data.json";
import Plant from "../Plant";
function GardenArea() {
  const { viewportRef, setIsPanning, viewport, clientSize, worldRef } =
    useViewportContext();
  const { plants, setPlants, currentTool, containers, setBoxPosition, setSelected } =
    useObjectContext();
  const [panMode, setPanMode] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  function handlePanStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(true);
  }

  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(false);
  }

  function findContainerAtPosition(x: number, y: number) {
    return (
      containers.find(
        (container) =>
          x >= container.position.x &&
          x <= container.position.x + container.width.value &&
          y >= container.position.y &&
          y <= container.position.y + container.length.value,
      ) ?? null
    );
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
      <Button
        className={styles.pan_button}
        variant="soft"
        onClick={() => setPanMode(!panMode)}
      >
        <Move />
        {panMode ? "Panning" : "Pan"}
      </Button>
      <Button
        className={styles.pan_button}
        variant="soft"
        onClick={() => setEditMode(!editMode)}
      >
        {editMode ? "Editing" : "Edit"}
      </Button>
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
        onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
          const target = event.target as HTMLElement;
          if (!target.closest(".planted")) {
            setSelected(null);
          }
        }}
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
          {containers.map((container: Container, index) => {
            return (
              <Draggable
                key={`${index}-${container.shape}`}
                object={container}
                initialPosition={{
                  x: container.position.x,
                  y: container.position.y,
                }}
                setObjectPosition={handleSetBoxPosition}
                shape={container.shape}
                enabled={panMode}
              >
                <GardenContainer
                  length={container.length.value * clientSize.xScale}
                  width={container.width.value * clientSize.yScale}
                  editable={editMode}
                  shape={container.shape}
                />
              </Draggable>
            );
          })}
          {plants.map((planted: PlantItem, index) => {
            const libraryItem = plantLibraryMap.get(planted.name);
            const container = planted.boxId
              ? containers.find((b) => b.id === planted.boxId)
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
                object={planted}
                shape={"circle"}
                className={styles.planted}
                enabled={panMode || editMode}
              >
                {libraryItem && (
                  <Plant plant={libraryItem} icon={libraryItem.icon} />
                )}
              </Draggable>
            );
          })}
        </div>
        {currentTool !== "none" && <CurrentTool tool={currentTool} />}
      </div>
    </div>
  );
}

export default GardenArea;
