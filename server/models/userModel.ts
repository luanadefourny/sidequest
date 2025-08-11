import mongoose from '../db';
import { Model, Types, Schema, Document } from 'mongoose';
import { IQuest } from './questModel';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; //TODO: can we define the regex rule here?
  firstName: string;
  lastName: string;
  age: number;
  isCurrent: boolean; //TODO: will we need this with auth and stuff?
  following: Types.ObjectId[]; // users you follow
  followers: Types.ObjectId[]; // users following you
  profilePicture: string;
  favoriteQuests: Types.ObjectId[]; // quests
  favoriteLocations: {
    label: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [lon, lat]
    };
  }[];
}

const FavoriteLocationSchema = new Schema({
  label: {
    type: String,
    required: true,
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
        message: 'coordinates must be [longitude, latitude]'
      }
    }
  }
}, { _id: false });

const UserSchema = new Schema<IUser>({
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
    required: true
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
  age: {
    type: Number,
    required: true,
    min: 13,
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  following: {
    type: [{
      type: Schema.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  followers: {
    type: [{
      type: Schema.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  profilePicture: {
    type: String,
    required: false,
  },
  favoriteQuests: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Quest',
    }],
    default: [],
  },
  favoriteLocations: {
    type: [FavoriteLocationSchema],
    default: [],
  },
});

//indexes make querying faster
UserSchema.index({ 'favoriteLocations.location': '2dsphere' })

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;