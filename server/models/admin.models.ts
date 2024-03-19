import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin extends Document {
  username: string;
  password: string;
}

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9]+$/.test(value);
        },
        message: function (props: { value: string }) {
          return `${props.value} is not a valid username!`;
        },
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return value.length >= 6;
        },
        message: function () {
          return "Password must be at least 6 characters long!";
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre<IAdmin>("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
