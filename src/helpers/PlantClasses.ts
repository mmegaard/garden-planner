export interface Box {
  id: number;
  shape: string;
  width: { value: number; measure: string };
  length: { value: number; measure: string };
  height: { value: number; measure: string };
  position: { x: number; y: number };
}

export class PlantItem {
  name: string;
  position: { x: number; y: number };
  id: number;
  boxId?: number;
  constructor(
    name: string,
    position: { x: number; y: number },
    id: number,
    boxId?: number,
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    if (boxId) {
      this.boxId = boxId;
    }
  }

  static fromJson(json: {
    id: number;
    name: string;
    position: { x: number; y: number };
    boxId?: number;
  }): PlantItem {
    return new PlantItem(json.name, json.position, json.id, json.boxId);
  }
  toJson(): {
    id: number;
    name: string;
    position: { x: number; y: number };
    boxId?: number;
  } {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      boxId: this.boxId,
    };
  }
}

// ─── Nested Interfaces ───────────────────────────────────────────────────────

export interface Measurement {
  minVal: number;
  maxVal: number;
  unit: string;
}

export interface DateRange {
  minDate: string;
  maxDate: string;
  description: string;
}

export interface TransplantWindow {
  condition: string;
  minDate: string;
  maxDate: string;
}

export interface OutdoorPlanting {
  spacingBetweenPlants: Measurement;
  whenToPlant: DateRange;
}

export interface IndoorPlanting {
  spacingBetweenPlants: Measurement;
  whenToStart: DateRange;
  transplantOutdoor: TransplantWindow;
}

export interface FromSeed {
  depth: Measurement;
  outdoor: OutdoorPlanting;
  indoor: IndoorPlanting;
}

export interface Planting {
  fromSeed: FromSeed;
}

export type LifeCycle = "Annual" | "Perennial" | "Biennial";

// ─── Icon config ─────────────────────────────────────────────────────────────

/**
 * Describes how to render a plant's icon.
 *
 * Think of it like a theatre costume note:
 *   base  → which actor (the SVG shape)
 *   color → what colour costume they wear
 *   scale → how close to the audience they stand (apparent size)
 */
export interface PlantIconConfig {
  /** Key into the icon registry, e.g. "tomato", "pepper", "leafy-green" */
  base: string;
  /** Primary fill colour – hex string, e.g. "#FF6347" */
  color: string;
  /** Multiplier relative to the default icon size (1 = 100%) */
  scale: number;
  /** Optional secondary colour for accents like stems or leaves */
  accentColor?: string;
}

// ─── Raw JSON shape (what comes in / goes out) ──────────────────────────────

export interface PlantLibraryItemJson {
  plantId: string;
  displayName: string;
  scientificName: string;
  family: string;
  planting: Planting;
  timeToRipe: Measurement;
  friends: string[];
  foes: string[];
  height: Measurement;
  growthDuration: LifeCycle;
  icon: PlantIconConfig;
}

// ─── Class ───────────────────────────────────────────────────────────────────

export class PlantLibraryItem {
  plantId: string;
  displayName: string;
  scientificName: string;
  family: string;
  planting: Planting;
  timeToRipe: Measurement;
  friends: string[];
  foes: string[];
  height: Measurement;
  growthDuration: LifeCycle;
  icon: PlantIconConfig;

  constructor(data: PlantLibraryItemJson) {
    this.plantId = data.plantId;
    this.displayName = data.displayName;
    this.scientificName = data.scientificName;
    this.family = data.family;
    this.planting = data.planting;
    this.timeToRipe = data.timeToRipe;
    this.friends = [...data.friends];
    this.foes = [...data.foes];
    this.height = data.height;
    this.growthDuration = data.growthDuration;
    this.icon = { ...data.icon };
  }

  // ── Deserialise ──────────────────────────────────────────────────────────

  static fromJson(json: PlantLibraryItemJson): PlantLibraryItem {
    return new PlantLibraryItem(json);
  }

  static fromJsonString(raw: string): PlantLibraryItem {
    const parsed: PlantLibraryItemJson = JSON.parse(raw);
    return PlantLibraryItem.fromJson(parsed);
  }

  static fromJsonArray(items: PlantLibraryItemJson[]): PlantLibraryItem[] {
    return items.map((item) => PlantLibraryItem.fromJson(item));
  }

  // ── Serialise ────────────────────────────────────────────────────────────

  toJson(): PlantLibraryItemJson {
    return {
      plantId: this.plantId,
      displayName: this.displayName,
      scientificName: this.scientificName,
      family: this.family,
      planting: this.planting,
      timeToRipe: this.timeToRipe,
      friends: [...this.friends],
      foes: [...this.foes],
      height: this.height,
      growthDuration: this.growthDuration,
      icon: { ...this.icon },
    };
  }

  toJsonString(pretty = false): string {
    return JSON.stringify(this.toJson(), null, pretty ? 2 : undefined);
  }
}
