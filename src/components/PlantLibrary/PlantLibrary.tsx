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

      if (filters.family && plant.family !== filters.family) {
        return false;
      }

      if (filters.plantableMonth !== null) {
        const { minDate, maxDate } =
          plant.planting.fromSeed.outdoor.whenToPlant;
        const minMonth = parseInt(minDate.split("-")[0]);
        const maxMonth = parseInt(maxDate.split("-")[0]);
        if (
          filters.plantableMonth < minMonth ||
          filters.plantableMonth > maxMonth
        ) {
          return false;
        }
      }

      if (filters.matureMonth !== null) {
        const { minDate, maxDate } =
          plant.planting.fromSeed.outdoor.whenToPlant;
        const { minVal, maxVal } = plant.timeToRipe;
        const earliestMature = addDaysToMonth(minDate, minVal);
        const latestMature = addDaysToMonth(maxDate, maxVal);
        if (
          filters.matureMonth < earliestMature ||
          filters.matureMonth > latestMature
        ) {
          return false;
        }
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

        <select
          value={filters.family ?? ""}
          onChange={(e) => setFilter("family", e.target.value || null)}
          className={styles.filterSelect}
        >
          <option value="">All families</option>
          {ALL_FAMILIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={filters.plantableMonth ?? ""}
          onChange={(e) =>
            setFilter(
              "plantableMonth",
              e.target.value ? parseInt(e.target.value) : null,
            )
          }
          className={styles.filterSelect}
        >
          <option value="">Plantable any month</option>
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={filters.matureMonth ?? ""}
          onChange={(e) =>
            setFilter(
              "matureMonth",
              e.target.value ? parseInt(e.target.value) : null,
            )
          }
          className={styles.filterSelect}
        >
          <option value="">Mature any month</option>
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
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
