"use client";
import React from "react";
import {
  PlantItem,
  Container,
  PlantLibraryItem,
  PlantLibraryItemJson,
  WorldObject,
} from "../../helpers/PlantClasses";
import { useViewportContext } from "../ViewportProvider";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import data from "@/public/content/data.json";

const plantLibraryMap = new Map(
  PlantLibraryItem.fromJsonArray(data.plants as PlantLibraryItemJson[]).map(
    (p) => [p.plantId, p],
  ),
);
interface ObjectProps {
  children: React.ReactNode;
}

export interface PlantFilters {
  family: string | null;
  plantableMonth: number | null;
  matureMonth: number | null;
}

export interface RegistryEntry {
  ref: React.RefObject<HTMLDivElement | null>;
  type: WorldObject["type"];
  shape: string;
  id: number;
}

type LiveDrag = {
  id: number;
  type: WorldObject["type"];
  x: number;
  y: number;
} | null;

const LiveDragContext = React.createContext<
  | {
      liveDrag: LiveDrag;
      setLiveDrag: React.Dispatch<React.SetStateAction<LiveDrag>>;
    }
  | undefined
>(undefined);

export function useLiveDrag() {
  const context = React.useContext(LiveDragContext);
  if (context === undefined) {
    throw new Error("useLiveDrag must be used within ObjectProvider");
  }
  return context;
}

export const ObjectContext = React.createContext<
  | {
      //containers: ;
      plants: PlantItem[];
      setPlants: (newPlants: PlantItem[]) => void;
      currentTool: string;
      setCurrentTool: React.Dispatch<React.SetStateAction<string>>;
      dragTarget: "plants" | "containers";
      setDragTarget: React.Dispatch<
        React.SetStateAction<"plants" | "containers">
      >;
      toolPosition: { x: number; y: number };
      setToolPosition: React.Dispatch<
        React.SetStateAction<{ x: number; y: number }>
      >;
      refRegistry: React.MutableRefObject<Map<string, RegistryEntry>>;
      registerRef: (
        id: number,
        ref: React.RefObject<HTMLDivElement | null>,
        type: WorldObject["type"],
        shape: string,
      ) => void;
      unregisterRef: (id: number, type: WorldObject["type"]) => void;
      collidingId: Set<number>;
      setCollidingId: React.Dispatch<React.SetStateAction<Set<number>>>;
      searchQuery: string;
      setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
      filters: PlantFilters;
      setFilters: React.Dispatch<React.SetStateAction<PlantFilters>>;
      containers: Container[];
      setBoxPosition: (id: number, x: number, y: number) => void;
      setBoxSize: (
        id: number,
        width: number,
        length: number,
        height: number,
      ) => void;
      selected: WorldObject | null;
      setSelected: React.Dispatch<React.SetStateAction<WorldObject | null>>;
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
  const containers: Container[] = (layouts[0]?.boxes ?? []).map((box) => ({
    ...box,
    type: "container" as const,
  }));

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

  const boxesMutation = useMutation(api.layouts.setBoxes).withOptimisticUpdate(
    (localStore, args) => {
      const layoutsList = localStore.getQuery(api.layouts.get);
      if (layoutsList !== undefined) {
        const newLayoutsList = [
          { ...layoutsList[0], boxes: args.boxes },
          ...layoutsList.slice(1),
        ];
        localStore.setQuery(api.layouts.get, {}, newLayoutsList);
      }
    },
  );

  const historyStack = React.useRef<
    { plants: PlantItem[]; boxes: Container[] }[]
  >([]);
  const redoStack = React.useRef<{ plants: PlantItem[]; boxes: Container[] }[]>(
    [],
  );
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  const pushHistory = (
    currentPlants: PlantItem[],
    currentBoxes: Container[],
  ) => {
    historyStack.current.push({ plants: currentPlants, boxes: currentBoxes });
    redoStack.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  const setPlants = (newPlants: PlantItem[]) => {
    pushHistory(plants, containers);
    layoutMutation({ plants: newPlants.map((p) => p.toJson()) });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toBoxRecord = ({ type, ...box }: Container) => box;

  const setBoxPosition = (id: number, x: number, y: number) => {
    pushHistory(plants, containers);
    const newBoxes = containers.map((box) =>
      box.id !== id ? box : { ...box, position: { x, y } },
    );
    boxesMutation({ boxes: newBoxes.map(toBoxRecord) });
  };

  const setBoxSize = (
    id: number,
    width: number,
    length: number,
    height: number,
  ) => {
    pushHistory(plants, containers);
    const newBoxes = containers.map((box: Container) =>
      box.id !== id
        ? box
        : {
            ...box,
            width: { value: width, measure: "ft" },
            length: { value: length, measure: "ft" },
            height: { value: height, measure: "ft" },
          },
    );
    boxesMutation({ boxes: newBoxes.map(toBoxRecord) });
  };
  const [selected, setSelected] = React.useState<WorldObject | null>(null);
  const [liveDrag, setLiveDrag] = React.useState<LiveDrag>(null);
  const liveDragValue = React.useMemo(
    () => ({ liveDrag, setLiveDrag }),
    [liveDrag],
  );
  const [currentTool, setCurrentTool] = React.useState("none");
  const [dragTarget, setDragTarget] = React.useState<"plants" | "containers">(
    "plants",
  );
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
    (
      id: number,
      ref: React.RefObject<HTMLDivElement | null>,
      type: WorldObject["type"],
      shape: string,
    ) => {
      refRegistry.current.set(`${type}-${id}`, { ref, type, shape, id });
    },
    [],
  );
  const unregisterRef = React.useCallback(
    (id: number, type: WorldObject["type"]) => {
      refRegistry.current.delete(`${type}-${id}`);
    },
    [],
  );
  const { viewportRef, viewport, clientSize, worldRef } = useViewportContext();

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const clickedElement: HTMLElement = event.target as HTMLElement;
      console.log(clickedElement.classList.contains("world"));
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
      if (
        currentTool === "add-container" ||
        currentTool === "add-circle-container"
      ) {
        const newId =
          containers.length > 0
            ? Math.max(...containers.map((c) => c.id)) + 1
            : 1;
        const newContainer: Container = {
          id: newId,
          type: "container",
          shape: currentTool === "add-circle-container" ? "circle" : "rectangle",
          width: { value: 1, measure: "ft" },
          length: { value: 1, measure: "ft" },
          height: { value: 1, measure: "ft" },
          position: { x: toolPosition.x - 0.5, y: toolPosition.y - 0.5 },
        };
        pushHistory(plants, containers);
        boxesMutation({
          boxes: [...containers.map(toBoxRecord), toBoxRecord(newContainer)],
        });
        setSelected(newContainer);
        setCurrentTool("none");
        return;
      }
      if (currentTool !== "none") {
        const newId =
          plants.length > 0 ? Math.max(...plants.map((p) => p.id)) + 1 : 1;
        const libraryItem = plantLibraryMap.get(currentTool);
        const radius = libraryItem
          ? libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants.minVal /
            12 /
            2
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
  }, [currentTool, toolPosition, clientSize, viewport, containers]);

  const deleteSelected = React.useCallback(() => {
    if (!selected) return;
    pushHistory(plants, containers);
    if (selected.type === "plant") {
      const newPlants = plants.filter((p) => p.id !== selected.id);
      layoutMutation({ plants: newPlants.map((p) => p.toJson()) });
    } else {
      const newBoxes = containers.filter((b) => b.id !== selected.id);
      const newPlants = plants.filter((p) => p.boxId !== selected.id);
      boxesMutation({ boxes: newBoxes.map(toBoxRecord) });
      layoutMutation({ plants: newPlants.map((p) => p.toJson()) });
    }
    setSelected(null);
  }, [selected, plants, containers]);

  const undo = React.useCallback(() => {
    const prev = historyStack.current.pop();
    if (!prev) return;
    redoStack.current.push({ plants, boxes: containers });
    layoutMutation({ plants: prev.plants.map((p) => p.toJson()) });
    boxesMutation({ boxes: prev.boxes.map(toBoxRecord) });
    setCanUndo(historyStack.current.length > 0);
    setCanRedo(true);
  }, [plants, containers]);

  const redo = React.useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    historyStack.current.push({ plants, boxes: containers });
    layoutMutation({ plants: next.plants.map((p) => p.toJson()) });
    boxesMutation({ boxes: next.boxes.map(toBoxRecord) });
    setCanUndo(true);
    setCanRedo(redoStack.current.length > 0);
  }, [plants, containers]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
      }
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key === "z"
      ) {
        event.preventDefault();
        undo();
      }
      if (
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "z") ||
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
      dragTarget,
      setDragTarget,
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
      containers: containers,
      setBoxPosition,
      setBoxSize,
      selected,
      setSelected,
      deleteSelected,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [
      plants,
      containers,
      currentTool,
      dragTarget,
      toolPosition,
      clientSize,
      viewport,
      collidingId,
      searchQuery,
      filters,
      selected,
      deleteSelected,
      undo,
      redo,
      canUndo,
      canRedo,
    ],
  );

  return (
    <ObjectContext.Provider value={contextValue}>
      <LiveDragContext.Provider value={liveDragValue}>
        {children}
      </LiveDragContext.Provider>
    </ObjectContext.Provider>
  );
}

export default ObjectProvider;
