import mongoose, { Schema, Document } from "mongoose";
import { encryptData, decryptData } from "../utils/encryption";

export interface ContextDocument extends Document {
    user: mongoose.Types.ObjectId;
    email: string;
    ip: string;
    country: string;
    city: string;
    browser: string;
    platform: string;
    os: string;
    device: string;
    deviceType: string;
    isTrusted: boolean;
}

const contextSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      ip: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      country: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      city: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      browser: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      platform: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      os: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      device: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      deviceType: {
        type: String,
        required: true,
        set: encryptData,
        get: decryptData,
      },
      isTrusted: {
        type: Boolean,
        required: true,
        default: true,
      },
});

const Context = mongoose.model<ContextDocument>("Context", contextSchema);
export default Context;