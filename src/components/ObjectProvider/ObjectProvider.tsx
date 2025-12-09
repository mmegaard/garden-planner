"use client";
import React from "react";
import layout from "@/public/content/boxes.json";
import PlantClass from "../../helpers/PlantClass"
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
  const contextValue = React.useMemo(
    () => ({
      plants,
      setPlants,
      currentTool,
      setCurrentTool
    }),
    [plants,currentTool]
  );

  return (
    <ObjectContext.Provider value={contextValue}>
      {children}
    </ObjectContext.Provider>
  );
}

export default ObjectProvider;
