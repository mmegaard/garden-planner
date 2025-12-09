"use client";
import * as React from "react";
import { motion, useMotionValue } from "motion/react";
import layout from "@/public/content/boxes.json";
import GardenContainer from "../GardenContainer";
import { Button } from "@radix-ui/themes";
import { Move } from "react-feather";
import Viewport from "../../helpers/Viewport";
import Plant from "../Plant";
import styles from "./GardenArea.module.css";
import Draggable from "../Draggable";
import { useViewportContext } from "../ViewportProvider";
import { useObjectContext } from "../ObjectProvider";
import PlantClass from "@/src/helpers/PlantClass";
import DraggableComponent from "../DraggableComponent"
function GardenArea() {
  const { viewportRef, setIsPanning, viewport, clientSize, worldRef } =
    useViewportContext();
  const {boxes} = layout;
  const {plants, setPlants, currentTool} = useObjectContext();
  const [panMode, setPanMode] = React.useState(false);
  function handlePanStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    setIsPanning(true);
  }
  
  function handlePanEnd(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || !panMode) return;
    //capture end of pan and set it
    setIsPanning(false);
  }
  
  function handleSetObjectPosition(id:number,x:number,y:number){
    const newPlants = plants.map((pl) => {
      if(pl.id === id){
        return pl
      }else{
       return {
          ...pl,
          position: {x,y},
        };
      }
    })
    setPlants(newPlants)
  }
  


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
        
        //take viewport and turn into         

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
          {boxes.map((box, index) => {
            return <GardenContainer box={box} key={`${index}-${box.shape}`} />;
          })}
          {plants.map((plant:PlantClass, index) => {
            return (
              <Draggable
                initialPosition={plant.position}
                key={`${index}-${plant.name}`}
                setObjectPosition={handleSetObjectPosition}
                id={plant.id}
                className={"planted"}
              >
                <Plant name={plant.name}></Plant>
              </Draggable>
            );
          })}
        
        </div>
        <img src={`${currentTool}.svg`} style={{display: currentTool === 'none' ? currentTool : "inline-block",position: "absolute", top:0, left:0, width:"100px", height:   "100px"}} />
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
