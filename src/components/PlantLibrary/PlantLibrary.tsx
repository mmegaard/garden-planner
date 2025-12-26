"use client";
import React, { useEffect } from "react";
import data from "@/public/content/data.json";
import Plant from "../Plant";
import { useObjectContext } from "../ObjectProvider";
import { MousePointer } from "react-feather";

function PlantLibrary() {
  const {currentTool,setCurrentTool} = useObjectContext();
  function handlePointerDown(event: React.PointerEvent, plantId:string) {
    const newTool = plantId;
    setCurrentTool(newTool)
  }
  useEffect(()=>{
    function handleEscapeKey(event:KeyboardEvent){
      if(event.key === 'Escape'){
        setCurrentTool('none')
      }
    }
    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [])
  //TODO: Make the escape key clear the tool
  return (
    <div
      id="plantLibraryContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        userSelect: 'none'
        
      }}
    >
      <div key={'pointericon'} 
          onPointerDown={(event)=>handlePointerDown(event,'none')}  
           className="toolSelector"
           style={{padding: "20%",width: "100px", height: "100px", borderRadius: "20%",backgroundColor: currentTool === "none" ? "#acfda0" : ""}} >
               <MousePointer width={"100%"} height={"100%"}  />
          </div>
      {data.plants.map((plant) => {
        //console.log(plant);
        //if clicked, make a draggable copy of the plant
        return (
          <div key={plant.scientificName} 
          onPointerDown={(event)=>handlePointerDown(event,plant.plantId)}   
          className="toolSelector"
          style={{
            width: "100px", 
            height: "100px", 
            backgroundColor: currentTool === plant.plantId ? "#acfda0" : "",
            borderRadius: "20%"
            }}> 
            
            
                <Plant name={plant.plantId}/>
          
              
          </div>
        );
      })}
    </div>
  );
}

export default PlantLibrary;
