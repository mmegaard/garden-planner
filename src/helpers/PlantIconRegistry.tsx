import React from "react";
import {
  TomatoIcon,
  PepperIcon,
  EggplantIcon,
  SquashIcon,
  CucumberIcon,
  PumpkinIcon,
  CornIcon,
  BeanIcon,
  PeaIcon,
  LeafyGreenIcon,
  RootVeggieIcon,
  BrassicaIcon,
  OnionIcon,
  PotatoIcon,
  HerbSprigIcon,
  HerbBushyIcon,
  DaisyFlowerIcon,
  TallFlowerIcon,
  ClusteredFlowerIcon,
  TrailingFlowerIcon,
  BerryBushIcon,
  StrawberryIcon,
} from "../../public/icons";
import type { PlantSvgProps } from "../../public/icons";

// ─── Registry ────────────────────────────────────────────────────────────────
//
// The phone book: each key maps to the SVG component that draws that shape.
// Multiple plants can share the same base icon — color & scale make them unique.
//

const iconRegistry = new Map<string, React.FC<PlantSvgProps>>([
  // ── Fruits / Vegetables ──
  ["tomato", TomatoIcon],
  ["pepper", PepperIcon],
  ["eggplant", EggplantIcon],
  ["squash", SquashIcon],
  ["cucumber", CucumberIcon],
  ["pumpkin", PumpkinIcon],
  ["corn", CornIcon],
  ["bean", BeanIcon],
  ["pea", PeaIcon],

  // ── Leafy / Root ──
  ["leafy-green", LeafyGreenIcon],
  ["root-veggie", RootVeggieIcon],
  ["brassica", BrassicaIcon],
  ["onion", OnionIcon],
  ["potato", PotatoIcon],

  // ── Herbs ──
  ["herb-sprig", HerbSprigIcon],
  ["herb-bushy", HerbBushyIcon],

  // ── Flowers ──
  ["daisy-flower", DaisyFlowerIcon],
  ["tall-flower", TallFlowerIcon],
  ["clustered-flower", ClusteredFlowerIcon],
  ["trailing-flower", TrailingFlowerIcon],

  // ── Berries ──
  ["berry-bush", BerryBushIcon],
  ["strawberry", StrawberryIcon],

  // ── Fallback ──
  ["generic", LeafyGreenIcon],
]);

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Look up an icon component by its base key.
 * Falls back to "generic" if the key isn't registered.
 */
export function getIconComponent(base: string): React.FC<PlantSvgProps> {
  return iconRegistry.get(base) ?? iconRegistry.get("generic")!;
}

/**
 * Register a new icon (or replace an existing one) at runtime.
 */
export function registerIcon(
  base: string,
  component: React.FC<PlantSvgProps>,
): void {
  iconRegistry.set(base, component);
}

/**
 * Get a list of all registered base keys.
 */
export function listRegisteredIcons(): string[] {
  return Array.from(iconRegistry.keys());
}
