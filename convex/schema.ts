import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



// Reusable validators for common structures
const measurementValidator = v.object({
  value: v.number(),
  measure: v.string(),
});

const positionValidator = v.object({
  top: v.number(),
  left: v.number(),
});

const plantPositionValidator = v.object({
  x: v.number(),
  y: v.number(),
});

// Garden validator
const gardenValidator = v.object({
  name: v.string(),
  width: v.number(),
  length: v.number(),
  x: v.number(),
  y: v.number(),
});

// Box validator
export const boxValidator = v.object({
  id: v.number(),
  shape: v.string(),
  width: measurementValidator,
  length: measurementValidator,
  height: measurementValidator,
  position: plantPositionValidator,
});

// Plant validator
const plantValidator = v.object({
  id: v.number(),
  boxId: v.optional(v.number()),
  name: v.string(),
  position: plantPositionValidator,
});

// Default view validator
const defaultViewValidator = v.object({
  width: v.number(),
  height: v.number(),
  x: v.number(),
  y: v.number(),
});

// Complete garden layout validator
export const gardenLayoutValidator = v.object({
  plants: v.array(plantValidator),
  boxes: v.optional(v.array(boxValidator)),
});

export default defineSchema({
  layouts: defineTable({
    plants: v.array(plantValidator),
    boxes: v.optional(v.array(boxValidator)),
  })
});