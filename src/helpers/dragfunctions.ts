import React from "react";
export function checkCollision(draggableRef:React.RefObject<HTMLDivElement | null>):string{
    const drag = draggableRef.current?.getBoundingClientRect()!;
    //for all of the other objects have a specific class, checkem
    const containers: HTMLCollectionOf<Element> =
      document.getElementsByClassName("bounding");
    for (let container of containers) {
      const target = container.getBoundingClientRect();
      const fullyInside =
        drag.left >= target.left &&
        drag.right <= target.right &&
        drag.top >= target.top &&
        drag.bottom <= target.bottom;

      const isColliding =
        drag.left < target.right &&
        drag.right > target.left &&
        drag.top < target.bottom &&
        drag.bottom > target.top;

      if (!fullyInside && isColliding) {
        
        return 'bad';
      }
    }
    
    
    const plantedPlants: HTMLCollectionOf<Element> =
      document.getElementsByClassName("planted");

    for (let plant of plantedPlants) {
      if(plant.classList.contains('dragging')){
        continue;
      }
      const target = plant.getBoundingClientRect();  

      if (drag.left < target.right &&
        drag.right > target.left &&
        drag.top < target.bottom &&
        drag.bottom > target.top) {
        return 'ok';
      }
    }
    
    
      return 'good';
  }

 export  export function handlePointerDown(event: React.PointerEvent) {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const rectDrag = draggableRef.current?.getBoundingClientRect()!;
    const offsetX = event.clientX - rectDrag.left;
    const offsetY = event.clientY - rectDrag.top;
    setOffset({ x: offsetX, y: offsetY });
    checkCollision();
  }
  export function handlePointerMove(event: React.PointerEvent) {
    if (isDragging) {
      const rect = viewportRef.current?.getBoundingClientRect()!;
      checkCollision();
      //mouse position relative to viewport
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const x = mouseX - offset.x;
      const y = mouseY - offset.y;
      const worldCoords = viewport.screenToWorld(
        x / clientSize.width,
        y / clientSize.height
      );
      setPosition({
        x: worldCoords[0],
        y: worldCoords[1],
      });
    }
  }

  export function handlePointerUp(event: React.PointerEvent) {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    setObjectPosition(id,position.x,position.y)
  }