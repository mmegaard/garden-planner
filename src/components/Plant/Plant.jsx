"use client";
import React from "react";

function Plant({ plant }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  function handleHover() {
    setIsHovering(!isHovering);
  }

  function handleDrag() {
    setIsDragging(!isDragging);
  }
  console.log(plant.planting.fromSeed.outdoor.spacingBetweenPlants);
  return (
    <div
      onMouseEnter={() => handleHover()}
      onFocus={() => handleHover()}
      onMouseLeave={() => handleHover()}
      onBlur={() => handleHover()}
      data-width={plant.planting.fromSeed.outdoor.spacingBetweenPlants.minVal}
    >
      <p>{plant.displayName}</p>
    </div>
  );
}

export default Plant;
