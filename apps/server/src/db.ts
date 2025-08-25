import mongoose from 'mongoose';
import { MONGODB_URI, DB_NAME, DB_PORT } from './env';

const uri = MONGODB_URI ?? `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`;

async function main(): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log(`Database connection established to ${DB_NAME}`);
  } catch (error) {
    console.log('Database connection failed:', error);
  }
}

main();

export default mongoose;
