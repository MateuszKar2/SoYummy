import mongoose, {Schema, Document} from "mongoose";

export interface Preference extends Document {
    user: mongoose.Types.ObjectId;
    enableContextBasedAuth: boolean;    
}

const preferenceSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  enableContextBasedAuth: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Preference = mongoose.model<Preference>("Preference", preferenceSchema);
export default Preference;