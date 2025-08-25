// apps/server/src/mongo.ts
// import { MongoClient } from "mongodb";
import mongoose from 'mongoose';
import { MONGODB_URI, DB_NAME, DB_PORT } from "./env";

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

// const globalForMongo = globalThis as unknown as { client?: MongoClient };

// export const mongoClient =
//   globalForMongo.client ?? new MongoClient(uri, { maxPoolSize: 10 });

// if (!globalForMongo.client) globalForMongo.client = mongoClient;

// export async function db() {
//   // connect() is idempotent in v4+, no need for topology check
//   await mongoClient.connect();
//   return mongoClient.db(); // default DB from URI
// }