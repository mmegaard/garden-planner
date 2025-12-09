"use client";
import React from "react";
import data from "@/public/content/data.json";
import Plant from "../Plant";
import { useObjectContext } from "../ObjectProvider";
import PlantClass from "@/src/helpers/PlantClass";
import { useViewportContext } from "../ViewportProvider";
import { MousePointer } from "react-feather";

import Draggable from "../Draggable";
function PlantLibrary() {
  const {plants, setPlants, setCurrentTool} = useObjectContext();
  const { viewportRef, viewport, clientSize } = useViewportContext();
  const [selectedPlant, setSelectedPlant] = React.useState('');
  const [selectedCoords, setSelectedCoords] = React.useState({x:0,y:0});
  function handlePointerDown(event: React.PointerEvent, plantId:string) {
    const newTool = plantId;
    setCurrentTool(newTool)
    //Initial position should just be the upper left 
    
    //add a new plant at the current pointer location in worldspace to the list of plants to be rendering. maybe in context?
  }

  function handleSetObjectPosition(id:number,x:number,y:number){
    const newPlant:PlantClass = new PlantClass(selectedPlant, {x, y},plants.length + 1)
    const newPlants = [...plants, newPlant]
    setPlants(newPlants)
    setSelectedCoords({x:0,y:0})
    setSelectedPlant('')
  }



  return (
    <div
      id="plantLibraryContainer"
      style={{
        border: "black 1px solid",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        userSelect: 'none'
        
      }}
    >
      <div key={'pointericon'} 
          onPointerDown={(event)=>handlePointerDown(event,'none')}  
           style={{width: "100px", height: "100px",}} >
               <MousePointer />
          </div>
      {data.plants.map((plant) => {
        //console.log(plant);
        //if clicked, make a draggable copy of the plant
        return (
          <div key={plant.scientificName} 
          onPointerDown={(event)=>handlePointerDown(event,plant.plantId)}  
          style={{width: "100px", height: "100px",}}> 
            
            
                <Plant name={plant.plantId}/>
          
              
          </div>
        );
      })}
    </div>
  );
}

export default PlantLibrary;
