import mongoose, { Schema, Document } from "mongoose";

export interface IngredientDocument extends Document {
  title: string;
  description: string;
  type?: string;
  thumbnail: string;
}

const ingredientSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String },
  thumbnail: { type: String },
});

const Ingredient = mongoose.model<IngredientDocument>("Ingredient", ingredientSchema);
export default Ingredient;
