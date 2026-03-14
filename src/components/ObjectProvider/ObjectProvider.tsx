"use client";
import React from "react";
import { PlantItem, Box, PlantLibraryItem, PlantLibraryItemJson } from "../../helpers/PlantClasses";
import { useViewportContext } from "../ViewportProvider";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import data from "@/public/content/data.json";

const plantLibraryMap = new Map(
  PlantLibraryItem.fromJsonArray(data.plants as PlantLibraryItemJson[]).map((p) => [p.plantId, p])
);
interface ObjectProps {
  children: React.ReactNode;
}

export type DraggableType = "plant" | "container";

export interface PlantFilters {
  family: string | null;
  plantableMonth: number | null;
  matureMonth: number | null;
}

export interface RegistryEntry {
  ref: React.RefObject<HTMLDivElement | null>;
  type: DraggableType;
  shape: string;
  id: number;
}

export const ObjectContext = React.createContext<
  | {
      //containers: ;
      plants: PlantItem[];
      setPlants: (newPlants: PlantItem[]) => void;
      currentTool: string;
      setCurrentTool: React.Dispatch<React.SetStateAction<string>>;
      toolPosition: { x: number; y: number };
      setToolPosition: React.Dispatch<
        React.SetStateAction<{ x: number; y: number }>
      >;
      refRegistry: React.MutableRefObject<Map<string, RegistryEntry>>;
      registerRef: (id: number, ref: React.RefObject<HTMLDivElement | null>, type: DraggableType, shape: string) => void;
      unregisterRef: (id: number, type: DraggableType) => void;
      collidingId: Set<number>;
      setCollidingId: React.Dispatch<React.SetStateAction<Set<number>>>;
      searchQuery: string;
      setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
      filters: PlantFilters;
      setFilters: React.Dispatch<React.SetStateAction<PlantFilters>>;
      boxes: Box[];
      setBoxPosition: (id: number, x: number, y: number) => void;
      selected: { id: number; type: DraggableType } | null;
      setSelected: React.Dispatch<React.SetStateAction<{ id: number; type: DraggableType } | null>>;
      deleteSelected: () => void;
      undo: () => void;
      redo: () => void;
      canUndo: boolean;
      canRedo: boolean;
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
// const initialPlants:PlantItem[] = layout.plants.map((plant)=>{
//   const newPlant:PlantItem = new PlantItem(plant.name, plant.position, plant.id)
//   if(plant.boxId){
//     newPlant.boxId = plant.boxId;
//   }
//   return newPlant;
// });
function ObjectProvider({ children }: ObjectProps) {
  const layouts = useQuery(api.layouts.get) || [];
  const plantList = layouts[0]?.plants || [];
  const plants = plantList.map((plant) => PlantItem.fromJson(plant));
  const boxes: Box[] = (layouts[0]?.boxes as Box[] | undefined) ?? [];

  const layoutMutation = useMutation(
    api.layouts.setGarden,
  ).withOptimisticUpdate((localStore, args) => {
    const layoutsList = localStore.getQuery(api.layouts.get);
    if (layoutsList !== undefined) {
      const newLayoutsList = [
        { ...layoutsList[0], plants: args.plants },
        ...layoutsList.slice(1),
      ];
      localStore.setQuery(api.layouts.get, {}, newLayoutsList);
    }
  });

  const boxesMutation = useMutation(
    api.layouts.setBoxes,
  ).withOptimisticUpdate((localStore, args) => {
    const layoutsList = localStore.getQuery(api.layouts.get);
    if (layoutsList !== undefined) {
      const newLayoutsList = [
        { ...layoutsList[0], boxes: args.boxes },
        ...layoutsList.slice(1),
      ];
      localStore.setQuery(api.layouts.get, {}, newLayoutsList);
    }
  });

  const historyStack = React.useRef<{ plants: PlantItem[]; boxes: Box[] }[]>([]);
  const redoStack = React.useRef<{ plants: PlantItem[]; boxes: Box[] }[]>([]);
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  const pushHistory = (currentPlants: PlantItem[], currentBoxes: Box[]) => {
    historyStack.current.push({ plants: currentPlants, boxes: currentBoxes });
    redoStack.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  const setPlants = (newPlants: PlantItem[]) => {
    pushHistory(plants, boxes);
    layoutMutation({ plants: newPlants.map((p) => p.toJson()) });
  };

  const setBoxPosition = (id: number, x: number, y: number) => {
    pushHistory(plants, boxes);
    const newBoxes = boxes.map((box) =>
      box.id !== id ? box : { ...box, position: { x, y } },
    );
    boxesMutation({ boxes: newBoxes });
  };
  const [selected, setSelected] = React.useState<{ id: number; type: DraggableType } | null>(null);
  const [currentTool, setCurrentTool] = React.useState("none");
  const [toolPosition, setToolPosition] = React.useState({ x: 0, y: 0 });
  const [collidingId, setCollidingId] = React.useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<PlantFilters>({
    family: null,
    plantableMonth: null,
    matureMonth: null,
  });
  const refRegistry = React.useRef<Map<string, RegistryEntry>>(new Map());
  const registerRef = React.useCallback(
    (id: number, ref: React.RefObject<HTMLDivElement | null>, type: DraggableType, shape: string) => {
      refRegistry.current.set(`${type}-${id}`, { ref, type, shape, id });
    },
    [],
  );
  const unregisterRef = React.useCallback((id: number, type: DraggableType) => {
    refRegistry.current.delete(`${type}-${id}`);
  }, []);
  const { viewportRef, viewport, clientSize, worldRef } = useViewportContext();

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const clickedElement: HTMLElement = event.target as HTMLElement;

      if (
        currentTool !== "none" &&
        clickedElement.classList.contains("toolSelector")
      ) {
        event.preventDefault();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);

    // Cleanup function:
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [currentTool]);

  React.useEffect(() => {
    //TODO: Make mousedown place an object and then start dragging if they hold it down
    function handlePointerMove(event: PointerEvent) {
      event.preventDefault();
      if (currentTool !== "none") {
        const rect = viewportRef.current?.getBoundingClientRect()!;
        console.log(
          "x,y",
          event.clientX - rect.left,
          ",",
          event.clientY - rect.top,
        );
        //mouse position relative to viewport
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        //console.log('current position in client', x,y)
        const worldCoords = viewport.screenToWorld(
          x / clientSize.width,
          y / clientSize.height,
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

  React.useEffect(() => {
    function handlePointerUp(event: PointerEvent) {
      event.preventDefault();
      if (currentTool !== "none") {
        const newId = plants.length > 0 ? Math.max(...plants.map((p) => p.id)) + 1 : 1;
        const libraryItem = plantLibraryMap.get(currentTool);
        const radius = libraryItem
          ? (libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12) / 2
          : 0;
        const newPlant: PlantItem = new PlantItem(
          currentTool,
          { x: toolPosition.x - radius, y: toolPosition.y - radius },
          newId,
        );
        const newPlants = [...plants, newPlant];
        setPlants(newPlants);
      }
    }
    viewportRef.current?.addEventListener("pointerup", handlePointerUp);

    // Cleanup function:
    return () => {
      viewportRef.current?.removeEventListener("pointerup", handlePointerUp);
    };
  }, [currentTool, toolPosition, clientSize, viewport]);

  const deleteSelected = React.useCallback(() => {
    if (!selected) return;
    pushHistory(plants, boxes);
    if (selected.type === "plant") {
      const newPlants = plants.filter((p) => p.id !== selected.id);
      layoutMutation({ plants: newPlants.map((p) => p.toJson()) });
    } else {
      const newBoxes = boxes.filter((b) => b.id !== selected.id);
      const newPlants = plants.filter((p) => p.boxId !== selected.id);
      boxesMutation({ boxes: newBoxes });
      layoutMutation({ plants: newPlants.map((p) => p.toJson()) });
    }
    setSelected(null);
  }, [selected, plants, boxes]);

  const undo = React.useCallback(() => {
    const prev = historyStack.current.pop();
    if (!prev) return;
    redoStack.current.push({ plants, boxes });
    layoutMutation({ plants: prev.plants.map((p) => p.toJson()) });
    boxesMutation({ boxes: prev.boxes });
    setCanUndo(historyStack.current.length > 0);
    setCanRedo(true);
  }, [plants, boxes]);

  const redo = React.useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    historyStack.current.push({ plants, boxes });
    layoutMutation({ plants: next.plants.map((p) => p.toJson()) });
    boxesMutation({ boxes: next.boxes });
    setCanUndo(true);
    setCanRedo(redoStack.current.length > 0);
  }, [plants, boxes]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
      }
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === "z") {
        event.preventDefault();
        undo();
      }
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z") ||
        ((event.ctrlKey || event.metaKey) && event.key === "y")
      ) {
        event.preventDefault();
        redo();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, undo, redo]);

  const contextValue = React.useMemo(
    () => ({
      plants,
      setPlants,
      currentTool,
      setCurrentTool,
      toolPosition,
      setToolPosition,
      refRegistry,
      registerRef,
      unregisterRef,
      collidingId,
      setCollidingId,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      boxes,
      setBoxPosition,
      selected,
      setSelected,
      deleteSelected,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [plants, boxes, currentTool, toolPosition, clientSize, viewport, collidingId, searchQuery, filters, selected, deleteSelected, undo, redo, canUndo, canRedo],
  );

  return (
    <ObjectContext.Provider value={contextValue}>
      {children}
    </ObjectContext.Provider>
  );
}

export default ObjectProvider;
