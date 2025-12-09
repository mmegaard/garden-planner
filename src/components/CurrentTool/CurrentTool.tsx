"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";
import { useObjectContext } from "../ObjectProvider";
interface CurrentToolProps {
  tool:string
}

function CurrentTool({ tool }: CurrentToolProps) {
  const{toolPosition} =useObjectContext()
  const { viewportRef, viewport, clientSize } = useViewportContext();
  

  

  return (
    <img src={`${tool}.svg`}
    style={{display: tool === 'none' ? tool : "inline-block",
        position: "absolute", 
        left: toolPosition.x * clientSize.xScale,
        top: toolPosition.y * clientSize.yScale,
        width:"100px", 
        height:"100px"}} />
    
  );
}

export default CurrentTool;