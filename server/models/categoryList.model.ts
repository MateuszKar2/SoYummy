import mongoose, { Schema, Document } from "mongoose";

export interface CategoryListDocument extends Document {
  _id: Object | String;
  title: String;
  thumb: String;
  description: String;
}

const categoryListSchema: Schema = new Schema({
  _id: { type: Object, required: true },
  title: {
    type: String,
    required: true,
  },
  thumb: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const CategoryList = mongoose.model<CategoryListDocument>(
  "CategoryList",
  categoryListSchema
);
export default CategoryList;
