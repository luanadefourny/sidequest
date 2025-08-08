import mongoose from 'mongoose';

const DB_PORT: string = '27017';
const DB_NAME: string = 'sidequest';

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