import mongoose, {Schema, Document} from "mongoose";

interface Ingredient {
    id: string;
    measure: string;
}
export interface RecipeDocument extends Document {
    _id:  string;
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
}

const recipeSchema: Schema = new Schema({
    _id: { type: Object, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    area: { type: String, required: true },
    instructions: { type: String, required: true },
    description: { type: String },
    thumb: { type: String, required: true },
    preview: { type: String },
    time: { type: String },
    favorites: { type: [String] },
    youtube: { type: String },
    tags: { type: [String], required: true },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
      },
    ingredients: { type: [{ id: Object, measure: String }], required: true },
})
const Recipe = mongoose.model<RecipeDocument>("Recipe", recipeSchema);
export default Recipe;