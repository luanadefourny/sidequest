import { Document, Model, Schema, Types } from 'mongoose';

import mongoose from '../db';

export interface IUser extends Document {
  _id: Types.ObjectId;
  __v: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  isCurrent: boolean; //TODO: will we need this with auth and stuff?
  following: Types.ObjectId[]; // users you follow
  followers: Types.ObjectId[]; // users following you
  profilePicture: string;
  myQuests: {
    quest: Types.ObjectId;
    isFavorite: boolean;
  }[]; // quests
  myLocations: {
    label: string;
    name?: string;
    address?: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [lon, lat]
    };
  }[];
}

const MyQuestSchema = new Schema(
  {
    quest: {
      type: Schema.ObjectId,
      ref: 'Quest',
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const MyLocationSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v: number[]) => Array.isArray(v) && v.length === 2,
          message: 'coordinates must be [longitude, latitude]',
        },
      },
    },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  following: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  followers: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  profilePicture: {
    type: String,
    required: false,
  },
  myQuests: {
    type: [MyQuestSchema],
    default: [],
  },
  myLocations: {
    type: [MyLocationSchema],
    default: [],
  },
});

//indexes make querying faster
UserSchema.index({ 'myLocations.location': '2dsphere' });
//doesn't let the password or __v get returned
UserSchema.set('toJSON', {
  transform(_doc: IUser, ret: Partial<IUser>) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
