import { query, mutation } from "./_generated/server";
import { v } from "convex/values"
import {gardenLayoutValidator} from "./schema"

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("layouts").collect();
  },
});

export const setGarden = mutation({
  args: gardenLayoutValidator,
  handler: async (ctx, args) => {
    const existingPromise = ctx.db.query("layouts").first()
    const existing = await existingPromise;
    if(existing === null){
      ctx.db.insert("layouts", args)
    }else{
      ctx.db.replace("layouts", existing._id ,args)
    }
  },
});