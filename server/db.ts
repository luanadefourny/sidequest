import mongoose from 'mongoose';

const DB_PORT: string | undefined = process.env.DB_PORT;
const DB_NAME: string | undefined = process.env.DB_NAME;
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

async function main(): Promise<void> {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`);
    // await mongoose.connect(`${MONGODB_URI}`);
    console.log(`Database connection established to ${DB_NAME}`);
  } catch (error) {
    console.log('Database connection failed:', error);
  }
}

main();

export default mongoose;
