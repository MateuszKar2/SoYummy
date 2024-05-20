import mongoose, { Schema, Document } from "mongoose";

interface Ingredient {
  id: string;
  measure: string;
}
export interface RecipeDocument extends Document {
  title: string;
  category: string;
  area: string;
  instructions: string;
  description: string;
  thumb: string;
  preview: string;
  time: string;
  favorites: string[];
  youtube: string;
  tags: string[];
  timestamp: Date;
  ingredients: Ingredient[];
  createdBy: string;
}

const recipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  area: { type: String, required: true },
  instructions: { type: String, required: true },
  description: { type: String },
  thumb: { type: String, required: true },
  preview: { type: String },
  time: { type: String },
  favorites: { type: [], ref: "User", default: [] },
  youtube: { type: String },
  tags: { type: [String], required: true },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ingredients: { type: [{ id: String, measure: String }], required: true },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
  },
});
const Recipe = mongoose.model<RecipeDocument>("Recipe", recipeSchema);
export default Recipe;
