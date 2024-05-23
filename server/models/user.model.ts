import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  avatar?: string;
  role: "general" | "moderator" | "admin";
  isEmailVerified: boolean;
  shoppingList: { id: string; measure: string }[];
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["general", "admin"],
      default: "general",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    shoppingList: {
      type: [{ id: String, measure: String }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ name: "text" });

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
