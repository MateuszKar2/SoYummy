import mongoose, { Document, Schema } from 'mongoose';

export interface ISuspiciousLogin extends Document {
  user: Schema.Types.ObjectId;
  createdAt: string;
  email: string;
  ip: string;
  country: string;
  city: string;
  browser: string;
  platform: string;
  os: string;
  device: string;
  deviceType: string;
  unverifiedAttempts: number;
  isTrusted: boolean;
  isBlocked: boolean;
}

const SuspiciousLoginSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    ip: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    browser: { type: String, required: true },
    platform: { type: String, required: true },
    os: { type: String, required: true },
    device: { type: String, required: true },
    deviceType: { type: String, required: true },
    unverifiedAttempts: { type: Number, default: 0 },
    isTrusted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const SuspiciousLogin = mongoose.model<ISuspiciousLogin>('SuspiciousLogin', SuspiciousLoginSchema);
export default SuspiciousLogin;