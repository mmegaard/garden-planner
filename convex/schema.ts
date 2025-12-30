import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...
  layouts: defineTable({
    data:v.any()
  })
});

