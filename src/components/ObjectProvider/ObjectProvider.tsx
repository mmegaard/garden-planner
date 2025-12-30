"use client";
import React from "react";
import PlantClass from "../../helpers/PlantClass"
import { useViewportContext } from "../ViewportProvider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


interface ObjectProps {
  children: React.ReactNode;
}



export const ObjectContext = React.createContext<
  | {
      //containers: ;
      plants: PlantClass[];
      setPlants:  (newPlants:PlantClass[])=>void;
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
// const initialPlants:PlantClass[] = layout.plants.map((plant)=>{
//   const newPlant:PlantClass = new PlantClass(plant.name, plant.position, plant.id)
//   if(plant.boxId){
//     newPlant.boxId = plant.boxId;
//   }
//   return newPlant;
// });

function ObjectProvider({ children }: ObjectProps) {
  const layouts = useQuery(api.layouts.get) || [];
  console.log('checkin query', layouts[0])
  const data = layouts[0]?.data || {}
  const {boxes, defaultView, gardens, initialPlants} = data
  
  const [plants,_setPlants] = React.useState<PlantClass[]>([])
  const setPlants = (newPlants:PlantClass[])=> {
    _setPlants(newPlants)
  }
  const [currentTool, setCurrentTool] = React.useState('none');
  const [toolPosition, setToolPosition] = React.useState({x:0,y:0});
  const {viewportRef, viewport, clientSize, worldRef} = useViewportContext();

  React.useEffect(()=>{
    function handlePointerDown(event: PointerEvent) {
      const clickedElement: HTMLElement = event.target as HTMLElement;

      if(currentTool !== 'none' && clickedElement.classList.contains("toolSelector")){
      event.preventDefault()
      }
       
      }
    document.addEventListener("pointerdown", handlePointerDown);
     
      // Cleanup function:
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }, [currentTool])

  React.useEffect(() => {
    //TODO: Make mousedown place an object and then start dragging if they hold it down
    function handlePointerMove(event: PointerEvent) {
    event.preventDefault()
    if (currentTool !== 'none') {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      console.log('x,y', event.clientX - rect.left, ',', event.clientY - rect.top)
      const xOffset =  100 * (clientSize.width / viewport.width / clientSize.xScale) / 2;
      const yOffset = 100 * (clientSize.height / viewport.height / clientSize.yScale) / 2;
      //console.log({xOffset})
      //mouse position relative to viewport
      const x = event.clientX - rect.left - xOffset;
      const y = event.clientY - rect.top - yOffset;
      //console.log('current position in client', x,y)
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
      document.addEventListener("pointermove", handlePointerMove);
     
      // Cleanup function:
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
      };
    }, [currentTool, viewport, clientSize, viewportRef]);
    
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

  }, [currentTool,toolPosition, clientSize, viewport])
  
  
  const contextValue = React.useMemo(
    () => ({
      plants,
      setPlants,
      currentTool,
      setCurrentTool,
      toolPosition,
      setToolPosition
    }),
    [plants,currentTool,toolPosition, clientSize, viewport]
  );

  return (
    <ObjectContext.Provider value={contextValue}>
      {children}
    </ObjectContext.Provider>
  );
}

export default ObjectProvider;
