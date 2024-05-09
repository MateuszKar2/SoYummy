import mongoose, { Schema, Document } from "mongoose";

export interface Token extends Document {
  user: mongoose.Types.ObjectId;
  refreshToken: string;
  accessToken: string;
  createdAt: Date;
  verificationToken: string;
}

const tokenSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  verificationToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 6 * 60 * 60, // 6 hours
  },
});

tokenSchema.pre<Token>("save", function (next) {
  if (!this.verificationToken) {
    this.verificationToken = new mongoose.Types.ObjectId().toHexString();
  }
  next();
});

const Token = mongoose.model<Token>("Token", tokenSchema);
export default Token;
