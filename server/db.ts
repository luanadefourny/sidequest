// import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, './.env') });//TODO change hwere it comes from 

// const DB_PORT: string | undefined = process.env.DB_PORT;
// const DB_NAME: string | undefined = process.env.DB_NAME;
// const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
const { DB_PORT, DB_NAME, MONGODB_URI } = process.env as Record<string, string | undefined>;

// async function main(): Promise<void> {
//   try {
//     await mongoose.connect(`mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`);
//     console.log(`Database connection established to ${DB_NAME}`);
//   } catch (error) {
//     console.log('Database connection failed:', error);
//   }
// }

// main();

// export default mongoose;

let cached = (global as any)._mongoose as
  | { conn?: typeof mongoose; promise?: Promise<typeof mongoose> }
  | undefined;
if (!cached) cached = (global as any)._mongoose = {};

export async function connectDB() {
  if (cached!.conn) {
    console.log('[db] using cached connection to db:', mongoose.connection.name);
    return cached!.conn;
  }

  // const uri =
  //   MONGODB_URI ||
  //   `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`;
  let uri: string;
  if (MONGODB_URI) {
    uri = MONGODB_URI;
  } else {
    const missing = ['DB_PORT', 'DB_NAME'].filter((k) => !process.env[k]);
    if (missing.length) {
      throw new Error(`[db] Missing required envs: ${missing.join(', ')}`);
    }
    uri = `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`;
  }

  if (!uri) throw new Error('No MongoDB URI');

    if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
      throw new Error(`Invalid MongoDB URI scheme: ${uri.split('://')[0] || '(none)'} → expected mongodb:// or mongodb+srv://`);
    }


  if (!cached!.promise) {
    console.log('[db] connecting...');
    cached!.promise = mongoose
      .connect(uri)
      .then((m) => {
        console.log('[db] connected');
        return m;
      })
      .catch((e) => {
        console.error('[db] connection error', e);
        throw e;
      });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default mongoose;