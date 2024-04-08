import mongoose, { Schema, Document } from "mongoose";
import { encryptField, decryptField, decryptData } from "../utils/encryption";

export interface ILog extends Document {
  email?: string;
  context: string;
  message: string;
  type: string;
  level: string;
  timestamp: Date;
  decryptContext: () => string;
}

const LogSchema: Schema = new Schema({
  email: { type: String },

  context: { type: String, set: encryptField, get: decryptField },

  message: { type: String, required: true },

  type: { type: String, required: true },

  level: { type: String, required: true },

  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 604800, // 1 week
  },
});

LogSchema.methods.decryptContext = function (): string {
  return decryptData(this.context);
};

const Log = mongoose.model<ILog>("Log", LogSchema);
export default Log;
