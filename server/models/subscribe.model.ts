import mongoose, {Schema, Document} from "mongoose";

export interface ISubscriber extends Document {
    user: mongoose.Types.ObjectId;
    subscriber: boolean;
    createdAt: Date;
}

const subscriberSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subscriber: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Subscriber = mongoose.model<ISubscriber>("Subscriber", subscriberSchema);
export default Subscriber;