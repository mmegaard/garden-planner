import React from "react";
import { useObjectContext } from "../ObjectProvider";
import styles from "./ObjectProperties.module.css";
import { Container, WorldObject } from "@/src/helpers/PlantClasses";

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

function ObjectProperties({ object }: ObjectPropertiesProps) {
  const { setBoxSize } = useObjectContext();
  const isBox = object.type === "container";
  const box = isBox ? (object as Container) : null;
  const title = isBox ? "Garden Container" : (object as { name: string }).name;

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

  type DimField = "widthFt" | "widthIn" | "lengthFt" | "lengthIn" | "heightFt" | "heightIn";

  function handleOnChange(field: DimField, value: number) {
    const next = { widthFt, widthIn, lengthFt, lengthIn, heightFt, heightIn, [field]: value };
    if (field === "widthFt") setWidthFt(value);
    else if (field === "widthIn") setWidthIn(value);
    else if (field === "lengthFt") setLengthFt(value);
    else if (field === "lengthIn") setLengthIn(value);
    else if (field === "heightFt") setHeightFt(value);
    else if (field === "heightIn") setHeightIn(value);
    commit(next.widthFt, next.widthIn, next.lengthFt, next.lengthIn, next.heightFt, next.heightIn);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.typeTag}>{isBox ? "Box" : "Plant"}</span>
        <span className={styles.title}>{title}</span>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>Position</div>
        <div className={styles.row}>
          <span className={styles.label}>X</span>
          <span className={styles.value}>
            {formatWorldPos(object.position.x)}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Y</span>
          <span className={styles.value}>
            {formatWorldPos(object.position.y)}
          </span>
        </div>
      </section>

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
                onChange={(e) => handleOnChange("widthFt", Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>ft</span>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                max={11}
                value={widthIn}
                onChange={(e) => handleOnChange("widthIn", Number(e.target.value))}
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
                onChange={(e) => handleOnChange("lengthFt", Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>ft</span>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                max={11}
                value={lengthIn}
                onChange={(e) => handleOnChange("lengthIn", Number(e.target.value))}
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
                onChange={(e) => handleOnChange("heightFt", Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
              <span className={styles.unit}>ft</span>
              <input
                className={styles.numInput}
                type="number"
                min={0}
                max={11}
                value={heightIn}
                onChange={(e) => handleOnChange("heightIn", Number(e.target.value))}
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
