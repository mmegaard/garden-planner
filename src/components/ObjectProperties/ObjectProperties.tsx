import React from "react";
import { useObjectContext, useLiveDrag } from "../ObjectProvider";
import styles from "./ObjectProperties.module.css";
import { Container, PlantItem, WorldObject } from "@/src/helpers/PlantClasses";
import PlantIcon from "../PlantIcon/PlantIcon";

interface ObjectPropertiesProps {
  object: WorldObject;
}

function decimalFeetToFtIn(val: number): { ft: number; inches: number } {
  const ft = Math.floor(val);
  const inches = Math.round((val - ft) * 12);
  return { ft, inches };
}

function formatWorldPos(val: number): string {
  return val.toFixed(2);
}

function formatRange(min: number, max: number, unit: string): string {
  return min === max ? `${min} ${unit}` : `${min}–${max} ${unit}`;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonthDay(mmdd: string): string {
  const [mm, dd] = mmdd.split("-").map(Number);
  if (!mm || !dd) return mmdd;
  return `${MONTHS[mm - 1]} ${dd}`;
}

function formatDateRange(min: string, max: string): string {
  return `${formatMonthDay(min)} – ${formatMonthDay(max)}`;
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function ObjectProperties({ object }: ObjectPropertiesProps) {
  const { setBoxSize, updatePlant, getPlantLibraryItem, plants, containers } =
    useObjectContext();
  const { liveDrag } = useLiveDrag();
  const live: WorldObject =
    object.type === "plant"
      ? plants.find((p) => p.id === object.id) ?? object
      : containers.find((c) => c.id === object.id) ?? object;
  const isBox = live.type === "container";
  const isPlant = live.type === "plant";
  const box = isBox ? (live as Container) : null;
  const plant = isPlant ? (live as PlantItem) : null;
  const libraryItem = plant ? getPlantLibraryItem(plant.name) : null;
  const title = isBox
    ? "Garden Container"
    : libraryItem?.displayName ?? (live as { name: string }).name;
  const displayPosition =
    liveDrag && liveDrag.id === live.id && liveDrag.type === live.type
      ? { x: liveDrag.x, y: liveDrag.y }
      : live.position;

  const [widthFt, setWidthFt] = React.useState(0);
  const [widthIn, setWidthIn] = React.useState(0);
  const [lengthFt, setLengthFt] = React.useState(0);
  const [lengthIn, setLengthIn] = React.useState(0);
  const [heightFt, setHeightFt] = React.useState(0);
  const [heightIn, setHeightIn] = React.useState(0);

  React.useEffect(() => {
    if (!box) return;
    const w = decimalFeetToFtIn(box.width.value);
    const l = decimalFeetToFtIn(box.length.value);
    const h = decimalFeetToFtIn(box.height.value);
    setWidthFt(w.ft);
    setWidthIn(w.inches);
    setLengthFt(l.ft);
    setLengthIn(l.inches);
    setHeightFt(h.ft);
    setHeightIn(h.inches);
  }, [box?.id]);

  function commit(
    wFt = widthFt,
    wIn = widthIn,
    lFt = lengthFt,
    lIn = lengthIn,
    hFt = heightFt,
    hIn = heightIn,
  ) {
    if (!box) return;
    setBoxSize(box.id, wFt + wIn / 12, lFt + lIn / 12, hFt + hIn / 12);
  }

  type DimField =
    | "widthFt"
    | "widthIn"
    | "lengthFt"
    | "lengthIn"
    | "heightFt"
    | "heightIn";

  function handleOnChange(field: DimField, value: number) {
    const next = {
      widthFt,
      widthIn,
      lengthFt,
      lengthIn,
      heightFt,
      heightIn,
      [field]: value,
    };
    if (field === "widthFt") setWidthFt(value);
    else if (field === "widthIn") setWidthIn(value);
    else if (field === "lengthFt") setLengthFt(value);
    else if (field === "lengthIn") setLengthIn(value);
    else if (field === "heightFt") setHeightFt(value);
    else if (field === "heightIn") setHeightIn(value);
    commit(
      next.widthFt,
      next.widthIn,
      next.lengthFt,
      next.lengthIn,
      next.heightFt,
      next.heightIn,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.typeTag}>{isBox ? "Box" : "Plant"}</span>
        {libraryItem && <PlantIcon icon={libraryItem.icon} baseSize={28} />}
        <span className={styles.title}>{title}</span>
      </div>

      <details className={styles.section} open>
        <summary className={styles.sectionLabel}>Position</summary>
        <div className={styles.row}>
          <span className={styles.label}>X</span>
          <span className={styles.value}>
            {formatWorldPos(displayPosition.x)}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Y</span>
          <span className={styles.value}>
            {formatWorldPos(displayPosition.y)}
          </span>
        </div>
      </details>

      {plant && (
        <>
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Details</div>
            {libraryItem && (
              <>
                <div className={styles.row}>
                  <span className={styles.label}>Scientific</span>
                  <span
                    className={styles.value}
                    style={{ fontStyle: "italic" }}
                  >
                    {libraryItem.scientificName}
                  </span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Family</span>
                  <span
                    className={styles.value}
                    style={{ textTransform: "capitalize" }}
                  >
                    {libraryItem.family}
                  </span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Lifecycle</span>
                  <span className={styles.value}>
                    {libraryItem.growthDuration}
                  </span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Seedling</span>
                  <span
                    className={styles.value}
                    style={{ textTransform: "capitalize" }}
                  >
                    {libraryItem.cotyledonType}
                  </span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Height</span>
                  <span className={styles.value}>
                    {formatRange(
                      libraryItem.height.minVal,
                      libraryItem.height.maxVal,
                      libraryItem.height.unit,
                    )}
                  </span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Time to ripe</span>
                  <span className={styles.value}>
                    {formatRange(
                      libraryItem.timeToRipe.minVal,
                      libraryItem.timeToRipe.maxVal,
                      libraryItem.timeToRipe.unit,
                    )}
                  </span>
                </div>
              </>
            )}
            <div className={styles.row}>
              <span className={styles.label}>Planted on</span>
              <input
                className={styles.dateInput}
                type="date"
                value={plant.datePlanted ?? ""}
                onChange={(e) =>
                  updatePlant(plant.id, {
                    datePlanted: e.target.value || undefined,
                  })
                }
              />
            </div>
          </section>

          {libraryItem && (
            <section className={styles.section}>
              <div className={styles.sectionLabel}>From Seed — Outdoor</div>
              <div className={styles.row}>
                <span className={styles.label}>Depth</span>
                <span className={styles.value}>
                  {formatRange(
                    libraryItem.planting.fromSeed.depth.minVal,
                    libraryItem.planting.fromSeed.depth.maxVal,
                    libraryItem.planting.fromSeed.depth.unit,
                  )}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Spacing</span>
                <span className={styles.value}>
                  {formatRange(
                    libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants
                      .minVal,
                    libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants
                      .maxVal,
                    libraryItem.planting.fromSeed.outdoor.spacingBetweenPlants
                      .unit,
                  )}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>When</span>
                <span className={styles.value}>
                  {formatDateRange(
                    libraryItem.planting.fromSeed.outdoor.whenToPlant.minDate,
                    libraryItem.planting.fromSeed.outdoor.whenToPlant.maxDate,
                  )}
                </span>
              </div>
              <div className={styles.note}>
                {libraryItem.planting.fromSeed.outdoor.whenToPlant.description}
              </div>
            </section>
          )}

          {libraryItem && (
            <section className={styles.section}>
              <div className={styles.sectionLabel}>From Seed — Indoor</div>
              <div className={styles.row}>
                <span className={styles.label}>Spacing</span>
                <span className={styles.value}>
                  {formatRange(
                    libraryItem.planting.fromSeed.indoor.spacingBetweenPlants
                      .minVal,
                    libraryItem.planting.fromSeed.indoor.spacingBetweenPlants
                      .maxVal,
                    libraryItem.planting.fromSeed.indoor.spacingBetweenPlants
                      .unit,
                  )}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Start</span>
                <span className={styles.value}>
                  {formatDateRange(
                    libraryItem.planting.fromSeed.indoor.whenToStart.minDate,
                    libraryItem.planting.fromSeed.indoor.whenToStart.maxDate,
                  )}
                </span>
              </div>
              <div className={styles.note}>
                {libraryItem.planting.fromSeed.indoor.whenToStart.description}
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Transplant</span>
                <span className={styles.value}>
                  {formatDateRange(
                    libraryItem.planting.fromSeed.indoor.transplantOutdoor
                      .minDate,
                    libraryItem.planting.fromSeed.indoor.transplantOutdoor
                      .maxDate,
                  )}
                </span>
              </div>
              <div className={styles.note}>
                {
                  libraryItem.planting.fromSeed.indoor.transplantOutdoor
                    .condition
                }
              </div>
            </section>
          )}

          {libraryItem &&
            (libraryItem.friends.length > 0 || libraryItem.foes.length > 0) && (
              <section className={styles.section}>
                <div className={styles.sectionLabel}>Companions</div>
                {libraryItem.friends.length > 0 && (
                  <div className={styles.chipRow}>
                    <span className={styles.label}>Friends</span>
                    <div className={styles.chips}>
                      {libraryItem.friends.map((f) => (
                        <span
                          key={f}
                          className={`${styles.chip} ${styles.chipFriend}`}
                        >
                          {titleCase(f)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {libraryItem.foes.length > 0 && (
                  <div className={styles.chipRow}>
                    <span className={styles.label}>Foes</span>
                    <div className={styles.chips}>
                      {libraryItem.foes.map((f) => (
                        <span
                          key={f}
                          className={`${styles.chip} ${styles.chipFoe}`}
                        >
                          {titleCase(f)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
        </>
      )}

      {box && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Dimensions</div>

          <div className={styles.row}>
            <span className={styles.label}>Width</span>
            <div className={styles.ftInInputs}>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                value={widthFt}
                onChange={(e) =>
                  handleOnChange("widthFt", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>ft</span>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                max={11}
                value={widthIn}
                onChange={(e) =>
                  handleOnChange("widthIn", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>in</span>
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Length</span>
            <div className={styles.ftInInputs}>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                value={lengthFt}
                onChange={(e) =>
                  handleOnChange("lengthFt", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>ft</span>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                max={11}
                value={lengthIn}
                onChange={(e) =>
                  handleOnChange("lengthIn", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>in</span>
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Height</span>
            <div className={styles.ftInInputs}>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                value={heightFt}
                onChange={(e) =>
                  handleOnChange("heightFt", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>ft</span>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                max={11}
                value={heightIn}
                onChange={(e) =>
                  handleOnChange("heightIn", Number(e.target.value))
                }
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>in</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ObjectProperties;
