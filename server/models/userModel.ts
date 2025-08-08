import mongoose from '../db';
import { Model } from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  isCurrent: boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  isCurrent: {
    type: Boolean,
    default: false
  }
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;