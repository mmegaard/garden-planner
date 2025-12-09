"use client";
import React from "react";
import layout from "@/public/content/boxes.json";
import PlantClass from "../../helpers/PlantClass"
import { useViewportContext } from "../ViewportProvider";
import { handlePointerMove } from "@/src/helpers/dragfunctions";
interface ObjectProps {
  children: React.ReactNode;
}

const { defaultView } = layout;

export const ObjectContext = React.createContext<
  | {
      //containers: ;
      plants: PlantClass[];
      setPlants:  React.Dispatch<React.SetStateAction<PlantClass[]>>;
      currentTool: string;
      setCurrentTool:  React.Dispatch<React.SetStateAction<string>>;
      toolPosition: {x:number,y:number};
      setToolPosition: React.Dispatch<React.SetStateAction<{x:number,y:number}>>;
    }
  | undefined
>(undefined);

export function useObjectContext() {
  const context = React.useContext(ObjectContext);
  if (context === undefined) {
    throw new Error("useObjectContext must be used within ObjectProvider");
  }
  return context;
}
const initialPlants:PlantClass[] = layout.plants.map((plant)=>{
  const newPlant:PlantClass = new PlantClass(plant.name, plant.position, plant.id)
  if(plant.boxId){
    newPlant.boxId = plant.boxId;
  }
  return newPlant;
});

function ObjectProvider({ children }: ObjectProps) {
  const [plants,setPlants] = React.useState(initialPlants)
  const [currentTool, setCurrentTool] = React.useState('none');
  const [toolPosition, setToolPosition] = React.useState({x:0,y:0});
  const {viewportRef, viewport, clientSize} = useViewportContext();

  React.useEffect(() => {
     function handlePointerMove(event: PointerEvent) {
    event.preventDefault()
    console.log('hi', currentTool)
    if (currentTool !== 'none') {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      
      //mouse position relative to viewport
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const worldCoords = viewport.screenToWorld(
        x / clientSize.width,
        y / clientSize.height
      );
      setToolPosition({
        x: worldCoords[0],
        y: worldCoords[1],
      });
    }
    }
      viewportRef.current?.addEventListener("pointermove", handlePointerMove);
     
      // Cleanup function:
      return () => {
        viewportRef.current?.removeEventListener("pointermove", handlePointerMove);
      };
    }, [toolPosition,currentTool]);
    
  React.useEffect(()=>{
    function handlePointerUp(event: PointerEvent) {
      event.preventDefault() 
        if(currentTool!== "none"){
          const newPlant:PlantClass = new PlantClass(currentTool, toolPosition,plants.length + 1)
          const newPlants = [...plants, newPlant]
          setPlants(newPlants)
        }
      }
        viewportRef.current?.addEventListener("pointerup", handlePointerUp);
     
      // Cleanup function:
      return () => {
        viewportRef.current?.removeEventListener("pointerup", handlePointerUp);
      };

  }, [currentTool,toolPosition])
  
  
  const contextValue = React.useMemo(
    () => ({
      plants,
      setPlants,
      currentTool,
      setCurrentTool,
      toolPosition,
      setToolPosition
    }),
    [plants,currentTool,toolPosition]
  );

  return (
    <ObjectContext.Provider value={contextValue}>
      {children}
    </ObjectContext.Provider>
  );
}

export default ObjectProvider;
