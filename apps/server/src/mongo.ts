// apps/server/src/mongo.ts
import { MongoClient } from "mongodb";
import { MONGODB_URI, DB_NAME, DB_PORT } from "./env";

const uri = MONGODB_URI ?? `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`;

const globalForMongo = globalThis as unknown as { client?: MongoClient };

export const mongoClient =
  globalForMongo.client ?? new MongoClient(uri, { maxPoolSize: 10 });

if (!globalForMongo.client) globalForMongo.client = mongoClient;

export async function db() {
  // connect() is idempotent in v4+, no need for topology check
  await mongoClient.connect();
  return mongoClient.db(); // default DB from URI
}