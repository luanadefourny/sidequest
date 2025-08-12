import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, './.env') });

const DB_PORT: string | undefined = process.env.DB_PORT;
const DB_NAME: string | undefined = process.env.DB_NAME;

async function main(): Promise<void> {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`);
    console.log(`Database connection established to ${DB_NAME}`)
  } catch (error) {
    console.log('Database connection failed:', error);
  }
}

main();

export default mongoose;