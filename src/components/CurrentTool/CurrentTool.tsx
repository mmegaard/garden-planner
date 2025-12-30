"use client";
import React from "react";
import { useViewportContext } from "../ViewportProvider";
import { useObjectContext } from "../ObjectProvider";
interface CurrentToolProps {
  tool:string
}

function CurrentTool({ tool }: CurrentToolProps) {
  const{currentTool,toolPosition} =useObjectContext()
  const {clientSize,viewport} = useViewportContext();
  const imgWidth = 100 * (clientSize.width / viewport.width / clientSize.xScale);
  const imgHeight = 100 * (clientSize.height / viewport.height / clientSize.yScale);
  const imgX = toolPosition.x * clientSize.xScale;
  const imgY = toolPosition.y * clientSize.yScale;
  return (
    <img src={`${currentTool}.svg`}
    alt={`${currentTool}`}
    style={{display: tool === 'none' ? tool : "inline-block",
        position: "absolute", 
        left: imgX,
        top: imgY,
        width: `${imgWidth}px`, 
        height: `${imgHeight}px`}} />
    
  );
}

export default CurrentTool;