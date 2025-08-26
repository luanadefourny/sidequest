import mongoose from 'mongoose';
import { MONGODB_URI } from "./env";

const uri = MONGODB_URI;
let cached: Promise<typeof mongoose> | undefined;

export function connectDB() {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (!cached) {
    cached = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
  }
  return cached;
}

export { mongoose };
