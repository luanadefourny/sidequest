import mongoose from '../db';
import { Model, Types, Schema, Document } from 'mongoose';

export interface IQuest extends Document {
  name: string;
  type: 'event' | 'place' | 'activity';
  location: {
    type: 'Point',
    coordinates: [number, number]; // [lon, lat]
  };
  ageRestricted: boolean;
  price?: number;
  currency?: string; // ISO 4217
  url?: string;
  startAt?: Date; // only for events
  endAt?: Date; // only for events
  description?: string;
  source?: string;
  sourceId?: string;
}

const LocationSchema = new Schema({
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
});
const QuestSchema = new Schema<IQuest>({
  name: { 
    type: String, 
    required: true, 
    trim: true,
  },
  type: { 
    type: String, 
    enum: ['event', 'place', 'activity'], 
    required: true,
  },
  location: {
    type: LocationSchema,
    required: true,
  },
  ageRestricted: { 
    type: Boolean, 
    default: false,
  },
  price: { 
    type: Number, 
    required: false, 
    min: 0,
  },
  currency: { 
    type: String, 
    required: false, 
    uppercase: true, 
    minlength: 3, 
    maxlength: 3,
  },
  url: { 
    type: String, 
    required: false,
  },
  startAt: { 
    type: Date,
  },
  endAt: {
    type: Date,
  },
  description: {
    type: String,
  },
  source: { 
    type: String,
  },
  sourceId:{
    type: String,
  },
}, { timestamps: true });

//indexes make querying fasterr
QuestSchema.index({ location: '2dsphere' });
QuestSchema.index({ startAt: 1, endAt: 1 });
QuestSchema.index({ source: 1, sourceId: 1 }, { unique: false });
QuestSchema.index({ name: 'text', description: 'text' });

const Quest: Model<IQuest> = mongoose.model<IQuest>('Quest', QuestSchema);

export default Quest;