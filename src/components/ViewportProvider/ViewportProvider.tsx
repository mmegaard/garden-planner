"use client";
import React from "react";
import layout from "@/public/content/boxes.json";
import Viewport from "../../helpers/Viewport";

interface ViewportProps {
  children: React.ReactNode;
}

const { defaultView } = layout;

export const ViewportContext = React.createContext<
  | {
      viewportRef: React.RefObject<HTMLDivElement | null>;
      worldRef: React.RefObject<HTMLDivElement | null>;

      viewport: Viewport;
      setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
      isPanning: boolean;
      setIsPanning: React.Dispatch<React.SetStateAction<boolean>>;
      clientSize: {
        width: number;
        height: number;
        xScale: number;
        yScale: number;
      };
      setClientSize: React.Dispatch<
        React.SetStateAction<{
          width: number;
          height: number;
          xScale: number;
          yScale: number;
        }>
      >;
    }
  | undefined
>(undefined);

export function useViewportContext() {
  const context = React.useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewportContext must be used within ViewportProvider");
  }
  return context;
}

function ViewportProvider({ children }: ViewportProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = React.useState(false);
  const worldRef = React.useRef<HTMLDivElement>(null);
  
  const [viewport, setViewport] = React.useState(
    new Viewport(
      defaultView.x,
      defaultView.y,
      defaultView.width,
      defaultView.height
    )
  );
  const [clientSize, setClientSize] = React.useState({
    width: 100 * viewport.width,
    height: 100 * viewport.height,
    xScale: 100,
    yScale: 100,
  });

  //get scaling of world to viewport pixelspace
  React.useLayoutEffect(() => {
    const updateDimensions = () => {

        if (viewportRef.current) {
          const scale = viewportRef.current.clientWidth / viewport.width;
          setClientSize({
            width: viewportRef.current.clientWidth,
            height: viewportRef.current.clientWidth,
            xScale: scale,
            yScale: scale,
          });
        }
      
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  //ZOOMING
  React.useEffect(() => {
    function handleMouseScroll(event: WheelEvent) {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      event.preventDefault;
      const zoomSpeed = 0.001;
      const deltaY = event.deltaY;
      const zoomLevel = 1 + deltaY * zoomSpeed;
      /*
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const worldCoords = viewport.screenToWorld(
        x / clientSize.width,
        y / clientSize.height
      );
      const beforeScale = clientSize.width / viewport.width / clientSize.xScale;
      */
      let newViewport= viewport.zoom(zoomLevel);
      /*const afterScale = clientSize.width / newViewport.width / clientSize.xScale;
      const scalechange = afterScale - beforeScale;
      const offsetX = (worldCoords[0] * scalechange);
      const offsetY = (worldCoords[1] * scalechange);
      newViewport = newViewport.pan(offsetX, offsetY)*/
      setViewport(newViewport);
    }

    viewportRef.current?.addEventListener("wheel", handleMouseScroll);

    // Cleanup function:
    return () => {
      viewportRef.current?.removeEventListener("wheel", handleMouseScroll);
    };
  }, [viewport]);

  React.useEffect(() => {
    function handlePanMove(event: MouseEvent) {
      //TODO: Make pan mode always active, if you are on a draggable, only drag the item
      if (isPanning) {
        const xBefore = (event.offsetX - event.movementX) / clientSize.width;
        const yBefore = (event.offsetY - event.movementY) / clientSize.height;

        const xAfter = event.offsetX / clientSize.width;
        const yAfter = event.offsetY / clientSize.height;

        const beforeWorld = viewport.screenToWorld(xBefore, yBefore);
        const afterWorld = viewport.screenToWorld(xAfter, yAfter);

        const newViewport = viewport.pan(
          beforeWorld[0] - afterWorld[0],
          beforeWorld[1] - afterWorld[1]
        );
        setViewport(newViewport);
      }
    }
    viewportRef.current?.addEventListener("mousemove", handlePanMove);

    // Cleanup function:
    return () => {
      viewportRef.current?.removeEventListener("mousemove", handlePanMove);
    };
  }, [isPanning, viewport]);

  const contextValue = React.useMemo(
    () => ({
      viewportRef,
      viewport,
      setViewport,
      isPanning,
      setIsPanning,
      clientSize,
      setClientSize,
      worldRef,
    }),
    [viewport, clientSize, isPanning]
  );

  return (
    <ViewportContext.Provider value={contextValue}>
      {children}
    </ViewportContext.Provider>
  );
}

export default ViewportProvider;
