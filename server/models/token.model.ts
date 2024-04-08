import mongoose, {Schema, Document} from "mongoose";

export interface Token extends Document {
    user: mongoose.Types.ObjectId;
    refreshToken: string;
    accessToken: string;
    createdAt: Date;
}

const tokenSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 6 * 60 * 60, // 6 hours
  },
});

const Token = mongoose.model<Token>("Token", tokenSchema);
export default Token;