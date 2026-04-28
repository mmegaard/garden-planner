"use client";
import React from "react";
import { MousePointer, Square, Circle, Move, Grid } from "react-feather";
import { useObjectContext } from "../ObjectProvider";
import styles from "./Toolbar.module.css";

type ToolDef = {
  id: string;
  label: string;
  Icon: React.ComponentType<{
    width?: number | string;
    height?: number | string;
    color?: string;
    strokeWidth?: number;
  }>;
  iconColor?: string;
  strokeWidth?: number;
};

const TOOLS: ToolDef[] = [
  { id: "none", label: "Select", Icon: MousePointer },
  { id: "pan", label: "Pan", Icon: Move },
  {
    id: "add-container",
    label: "Add box",
    Icon: Square,
    iconColor: "rgb(172, 107, 33)",
    strokeWidth: 3,
  },
  {
    id: "add-circle-container",
    label: "Add circle",
    Icon: Circle,
    iconColor: "rgb(172, 107, 33)",
    strokeWidth: 3,
  },
];

function Toolbar() {
  const {
    currentTool,
    setCurrentTool,
    dragTarget,
    setDragTarget,
    showGrid,
    setShowGrid,
  } = useObjectContext();
  const segmentedDisabled = currentTool !== "none";
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Tools">
      {TOOLS.map(({ id, label, Icon, iconColor, strokeWidth }) => {
        const active = currentTool === id;
        return (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            onPointerDown={(e) => {
              e.preventDefault();
              setCurrentTool(id);
            }}
            className={`${styles.toolButton} ${active ? styles.active : ""}`}
          >
            <Icon
              width={32}
              height={32}
              color={iconColor}
              strokeWidth={strokeWidth}
            />
          </button>
        );
      })}
      <div className={styles.divider} aria-hidden />
      <div
        className={styles.segmented}
        role="radiogroup"
        aria-label="Drag target"
        title={
          segmentedDisabled
            ? "Switch to Select to choose what to drag"
            : "Choose whether to drag plants or containers"
        }
      >
        <button
          type="button"
          role="radio"
          aria-checked={dragTarget === "plants"}
          disabled={segmentedDisabled}
          onClick={() => setDragTarget("plants")}
          className={`${styles.segmentedButton} ${
            dragTarget === "plants" ? styles.active : ""
          }`}
        >
          Plants
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={dragTarget === "containers"}
          disabled={segmentedDisabled}
          onClick={() => setDragTarget("containers")}
          className={`${styles.segmentedButton} ${
            dragTarget === "containers" ? styles.active : ""
          }`}
        >
          Containers
        </button>
      </div>
      <div className={styles.divider} aria-hidden />
      <button
        type="button"
        title="Toggle grid"
        aria-label="Toggle grid"
        aria-pressed={showGrid}
        onPointerDown={(e) => {
          e.preventDefault();
          setShowGrid((v) => !v);
        }}
        className={`${styles.toolButton} ${showGrid ? styles.active : ""}`}
      >
        <Grid width={32} height={32} />
      </button>
    </div>
  );
}

export default Toolbar;
