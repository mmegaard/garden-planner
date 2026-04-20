import { Container, PlantItem, PlantLibraryItem } from "./PlantClasses";

// Must stay in sync with Plant.tsx, which caps the rendered SVG at 80px.
export const PLANT_SVG_MAX_PX = 80;

export function getPlantRadius(
  plantName: string,
  libraryMap: Map<string, PlantLibraryItem>,
): number {
  const item = libraryMap.get(plantName);
  if (!item) return 0;
  return item.planting.fromSeed.outdoor.spacingBetweenPlants.minVal / 12 / 2;
}

export function getPlantSvgRadius(
  plantName: string,
  libraryMap: Map<string, PlantLibraryItem>,
  xScale: number,
): number {
  const footprint = getPlantRadius(plantName, libraryMap);
  const svgCapInFeet = PLANT_SVG_MAX_PX / 2 / xScale;
  return Math.min(footprint, svgCapInFeet);
}

export function findContainingBox(
  point: { x: number; y: number },
  radius: number,
  containers: Container[],
): Container | null {
  for (const c of containers) {
    const left = c.position.x;
    const top = c.position.y;
    const right = left + c.length.value;
    const bottom = top + c.width.value;
    if (
      point.x - radius >= left &&
      point.x + radius <= right &&
      point.y - radius >= top &&
      point.y + radius <= bottom
    ) {
      return c;
    }
  }
  return null;
}

function plantWorldTopLeft(
  plant: PlantItem,
  containers: Container[],
): { x: number; y: number } {
  if (plant.boxId) {
    const c = containers.find((c) => c.id === plant.boxId);
    if (c) {
      return {
        x: c.position.x + plant.position.x,
        y: c.position.y + plant.position.y,
      };
    }
  }
  return plant.position;
}

export function getPlantClipPath(
  plantWorldTopLeft: { x: number; y: number },
  footprintRadius: number,
  svgRadius: number,
  containers: Container[],
  xScale: number,
): string | undefined {
  const plantLeft = plantWorldTopLeft.x;
  const plantTop = plantWorldTopLeft.y;
  const plantSize = 2 * footprintRadius;
  const plantRight = plantLeft + plantSize;
  const plantBottom = plantTop + plantSize;

  const svgCenterX = plantLeft + footprintRadius;
  const svgCenterY = plantTop + footprintRadius;
  const svgLeft = svgCenterX - svgRadius;
  const svgRight = svgCenterX + svgRadius;
  const svgTop = svgCenterY - svgRadius;
  const svgBottom = svgCenterY + svgRadius;

  const inside = containers.find((c) => {
    const cLeft = c.position.x;
    const cTop = c.position.y;
    const cRight = cLeft + c.length.value;
    const cBottom = cTop + c.width.value;
    return (
      svgLeft >= cLeft &&
      svgRight <= cRight &&
      svgTop >= cTop &&
      svgBottom <= cBottom
    );
  });

  if (inside) {
    const cRight = inside.position.x + inside.length.value;
    const cBottom = inside.position.y + inside.width.value;
    const topPct = (Math.max(0, inside.position.y - plantTop) / plantSize) * 100;
    const rightPct = (Math.max(0, plantRight - cRight) / plantSize) * 100;
    const bottomPct = (Math.max(0, plantBottom - cBottom) / plantSize) * 100;
    const leftPct = (Math.max(0, inside.position.x - plantLeft) / plantSize) * 100;
    if (topPct === 0 && rightPct === 0 && bottomPct === 0 && leftPct === 0) {
      return undefined;
    }
    return `inset(${topPct}% ${rightPct}% ${bottomPct}% ${leftPct}%)`;
  }

  const holes: string[] = [];
  for (const c of containers) {
    const cLeft = c.position.x;
    const cTop = c.position.y;
    const cRight = cLeft + c.length.value;
    const cBottom = cTop + c.width.value;

    const svgDisjoint =
      svgRight <= cLeft ||
      svgLeft >= cRight ||
      svgBottom <= cTop ||
      svgTop >= cBottom;
    if (!svgDisjoint) continue;

    const hLeft = Math.max(plantLeft, cLeft);
    const hTop = Math.max(plantTop, cTop);
    const hRight = Math.min(plantRight, cRight);
    const hBottom = Math.min(plantBottom, cBottom);
    if (hLeft >= hRight || hTop >= hBottom) continue;

    const pxL = (hLeft - plantLeft) * xScale;
    const pxT = (hTop - plantTop) * xScale;
    const pxR = (hRight - plantLeft) * xScale;
    const pxB = (hBottom - plantTop) * xScale;
    holes.push(`M ${pxL} ${pxT} L ${pxR} ${pxT} L ${pxR} ${pxB} L ${pxL} ${pxB} Z`);
  }

  if (holes.length === 0) return undefined;

  const sizePx = plantSize * xScale;
  const outer = `M 0 0 L ${sizePx} 0 L ${sizePx} ${sizePx} L 0 ${sizePx} Z`;
  return `path(evenodd, '${outer} ${holes.join(" ")}')`;
}

export function reconcilePlantPosition(
  plant: PlantItem,
  containers: Container[],
  libraryMap: Map<string, PlantLibraryItem>,
  xScale: number,
): PlantItem {
  const footprintRadius = getPlantRadius(plant.name, libraryMap);
  const svgRadius = getPlantSvgRadius(plant.name, libraryMap, xScale);
  const worldTopLeft = plantWorldTopLeft(plant, containers);
  const worldCenter = {
    x: worldTopLeft.x + footprintRadius,
    y: worldTopLeft.y + footprintRadius,
  };
  const container = findContainingBox(worldCenter, svgRadius, containers);

  if (container) {
    return new PlantItem(
      plant.name,
      {
        x: worldTopLeft.x - container.position.x,
        y: worldTopLeft.y - container.position.y,
      },
      plant.id,
      container.id,
    );
  }
  return new PlantItem(plant.name, worldTopLeft, plant.id);
}
