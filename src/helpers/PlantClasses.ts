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
  }

  // ── Deserialise ──────────────────────────────────────────────────────────

  /**
   * Build a PlantLibraryItem from a plain object (e.g. parsed JSON).
   *
   * Think of it like a factory assembly line: raw materials (JSON) come in,
   * and a fully-formed class instance rolls off the end.
   */
  static fromJson(json: PlantLibraryItemJson): PlantLibraryItem {
    return new PlantLibraryItem(json);
  }

  /**
   * Convenience helper – parse a raw JSON *string* directly.
   */
  static fromJsonString(raw: string): PlantLibraryItem {
    const parsed: PlantLibraryItemJson = JSON.parse(raw);
    return PlantLibraryItem.fromJson(parsed);
  }

  /**
   * Build an array of PlantLibraryItems from a JSON array.
   */
  static fromJsonArray(items: PlantLibraryItemJson[]): PlantLibraryItem[] {
    return items.map((item) => PlantLibraryItem.fromJson(item));
  }

  // ── Serialise ────────────────────────────────────────────────────────────

  /**
   * Return a plain object that matches the original JSON shape.
   *
   * This is the reverse trip on that assembly line – taking the class
   * instance apart into a simple object that JSON.stringify understands.
   */
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
    };
  }

  /**
   * Serialise straight to a JSON string.
   */
  toJsonString(pretty = false): string {
    return JSON.stringify(this.toJson(), null, pretty ? 2 : undefined);
  }
}
