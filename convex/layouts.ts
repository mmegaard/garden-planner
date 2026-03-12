import { query, mutation } from "./_generated/server";
import { v } from "convex/values"
import { boxValidator } from "./schema"

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("layouts").collect();
  },
});

export const setGarden = mutation({
  args: { plants: v.array(v.object({
    id: v.number(),
    boxId: v.optional(v.number()),
    name: v.string(),
    position: v.object({ x: v.number(), y: v.number() }),
  })) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("layouts").first();
    if (existing === null) {
      ctx.db.insert("layouts", { plants: args.plants, boxes: [] });
    } else {
      ctx.db.patch(existing._id, { plants: args.plants });
    }
  },
});

export const setBoxes = mutation({
  args: { boxes: v.array(boxValidator) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("layouts").first();
    if (existing === null) {
      ctx.db.insert("layouts", { plants: [], boxes: args.boxes });
    } else {
      ctx.db.patch(existing._id, { boxes: args.boxes });
    }
  },
});