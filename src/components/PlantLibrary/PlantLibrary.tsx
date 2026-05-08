"use client";
import React, { useEffect, useMemo } from "react";
import data from "@/public/content/data.json";
import Plant from "../Plant";
import {
  PlantLibraryItem,
  PlantLibraryItemJson,
} from "../../helpers/PlantClasses";
import { useObjectContext } from "../ObjectProvider";
import styles from "./PlantLibrary.module.css";
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

const ALL_FAMILIES = [
  "allium",
  "amaranth",
  "asparagus",
  "aster",
  "brassica",
  "brassicales",
  "buckwheat",
  "cucurbit",
  "grass",
  "heath",
  "legume",
  "mint",
  "nightshade",
  "rose",
  "umbellifer",
];

function addDaysToMonth(mmdd: string, days: number): number {
  const [month, day] = mmdd.split("-").map(Number);
  const date = new Date(2000, month - 1, day);
  date.setDate(date.getDate() + days);
  return date.getMonth() + 1;
}

interface MultiSelectProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
  emptyLabel: string;
  sort?: (a: T, b: T) => number;
}

function MultiSelect<T extends string | number>({
  options,
  value,
  onChange,
  emptyLabel,
  sort,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function toggle(item: T) {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      const next = [...value, item];
      onChange(sort ? next.sort(sort) : next);
    }
  }

  const labelByValue = new Map(options.map((o) => [o.value, o.label]));
  const summary =
    value.length === 0
      ? emptyLabel
      : value.map((v) => labelByValue.get(v) ?? String(v)).join(", ");

  return (
    <div className={styles.multiSelect} ref={ref}>
      <button
        type="button"
        className={styles.multiSelectButton}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.multiSelectSummary}>{summary}</span>
        <span className={styles.multiSelectCaret}>▾</span>
      </button>
      {open && (
        <div className={styles.multiSelectMenu}>
          {options.map((opt) => {
            const checked = value.includes(opt.value);
            return (
              <label key={String(opt.value)} className={styles.multiSelectOption}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlantLibrary() {
  const {
    currentTool,
    setCurrentTool,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
  } = useObjectContext();

  function handlePointerDown(event: React.PointerEvent, plantId: string) {
    console.log("where am I?", event, plantId);
    setCurrentTool(plantId);
  }

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCurrentTool("none");
      }
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const allPlants = PlantLibraryItem.fromJsonArray(
    data.plants as PlantLibraryItemJson[],
  );

  const filteredPlants = useMemo(() => {
    return allPlants.filter((plant) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !plant.displayName.toLowerCase().includes(q) &&
          !plant.scientificName.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (filters.family.length > 0 && !filters.family.includes(plant.family)) {
        return false;
      }

      if (filters.plantableMonth.length > 0) {
        const { minDate, maxDate } =
          plant.planting.fromSeed.outdoor.whenToPlant;
        const minMonth = parseInt(minDate.split("-")[0]);
        const maxMonth = parseInt(maxDate.split("-")[0]);
        const matches = filters.plantableMonth.some(
          (m) => m >= minMonth && m <= maxMonth,
        );
        if (!matches) return false;
      }

      if (filters.matureMonth.length > 0) {
        const { minDate, maxDate } =
          plant.planting.fromSeed.outdoor.whenToPlant;
        const { minVal, maxVal } = plant.timeToRipe;
        const earliestMature = addDaysToMonth(minDate, minVal);
        const latestMature = addDaysToMonth(maxDate, maxVal);
        const matches = filters.matureMonth.some(
          (m) => m >= earliestMature && m <= latestMature,
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  function setFilter<K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className={styles.panel}>
      <div className={styles.sticky}>
        <input
          type="text"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Family</span>
          <MultiSelect
            options={ALL_FAMILIES.map((f) => ({ value: f, label: f }))}
            value={filters.family}
            onChange={(v) => setFilter("family", v)}
            emptyLabel="All families"
            sort={(a, b) => a.localeCompare(b)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Plantable in</span>
          <MultiSelect
            options={MONTHS.map((name, i) => ({ value: i + 1, label: name }))}
            value={filters.plantableMonth}
            onChange={(v) => setFilter("plantableMonth", v)}
            emptyLabel="Any month"
            sort={(a, b) => a - b}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>Mature in</span>
          <MultiSelect
            options={MONTHS.map((name, i) => ({ value: i + 1, label: name }))}
            value={filters.matureMonth}
            onChange={(v) => setFilter("matureMonth", v)}
            emptyLabel="Any month"
            sort={(a, b) => a - b}
          />
        </div>
      </div>
      <div id="plantLibraryContainer" className={styles.plantList}>
        {filteredPlants.map((plant: PlantLibraryItem) => (
          <div
            key={plant?.scientificName}
            onPointerDown={(event) => handlePointerDown(event, plant.plantId)}
            title={plant.displayName}
            className={`toolSelector ${styles.plantItem} ${
              currentTool === plant.plantId ? styles.active : ""
            }`}
          >
            <Plant plant={plant} icon={plant.icon} displaySize={100} />
            <p className={styles.plantName}>{plant.displayName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlantLibrary;
