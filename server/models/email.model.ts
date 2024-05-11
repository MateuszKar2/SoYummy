import mongoose, {Schema, Document} from "mongoose";

export interface EmailDocument extends Document {
    email: string;
    verificationCode: string;
    messageId: string;
    for: string;
    createdAt: Date;
}

const emailSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true,
        unique: true
    },
    messageId: {
        type: String,
        required: true
    },
    for: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800,
    }
})
const Email = mongoose.model<EmailDocument>("Email", emailSchema);
export default Email;