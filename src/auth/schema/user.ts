import { Document, Schema, model, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  points: number;
  referralCode: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    require: true,
    default: 0,
  },
  points: {
    type: Number,
    require: true,
    default: 0,
  },
  referralCode: {
    type: String,
  },
});

export const User: Model<IUser> = model<IUser>("User", userSchema);
