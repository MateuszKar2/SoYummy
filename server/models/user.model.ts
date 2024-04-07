import mongoose, {Schema, Document} from "mongoose";

export interface UserDocument extends Document {
  email: string;
  password: string;
  avatar?: string;
  role: "general" | "moderator" | "admin";
  savedPosts: mongoose.Types.ObjectId[];
  isEmailVerified: boolean;
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
      savedPosts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
          default: [],
        },
      ],
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );
  
  userSchema.index({ name: "text" });
  
  const User = mongoose.model<UserDocument>("User", userSchema);
  export default User;