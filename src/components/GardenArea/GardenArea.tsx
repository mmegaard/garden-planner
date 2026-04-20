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
import {
  reconcilePlantPosition,
  getPlantRadius,
  getPlantSvgRadius,
} from "../../helpers/containment";
function GardenArea() {
  const { viewportRef, setIsPanning, viewport, clientSize, worldRef } =
    useViewportContext();
  const { plants, setPlants, currentTool, containers, setBoxPosition } =
    useObjectContext();
  const [panMode, setPanMode] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  const plantLibraryMap = new Map(
    PlantLibraryItem.fromJsonArray(data.plants as PlantLibraryItemJson[]).map(
      (p) => [p.plantId, p],
    ),
  );

  function handlePanStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(true);
  }

  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(false);
  }

  function handleSetPlantPosition(id: number, x: number, y: number) {
    const newPlants = plants.map((pl) => {
      if (pl.id !== id) return pl;
      const moved = new PlantItem(pl.name, { x, y }, pl.id);
      return reconcilePlantPosition(
        moved,
        containers,
        plantLibraryMap,
        clientSize.xScale,
      );
    });
    setPlants(newPlants);
  }

  function handleSetBoxPosition(id: number, x: number, y: number) {
    setBoxPosition(id, x, y);
  }
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
                plantRadius={getPlantRadius(planted.name, plantLibraryMap)}
                plantSvgRadius={getPlantSvgRadius(
                  planted.name,
                  plantLibraryMap,
                  clientSize.xScale,
                )}
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
