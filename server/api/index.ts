import cookieParser from 'cookie-parser';
import cors from 'cors';
// import dotenv from 'dotenv';
import express, { Application } from 'express';
// import mongoose from 'mongoose';
import path from 'path';

import { connectDB } from '../db';
// dotenv.config({ path: path.resolve(__dirname, '../.env')}); //TODO change where it comes from
import apiRouter from '../routers/apiRouter';
import questRouter from '../routers/questRouter';
import userRouter from '../routers/userRouter';

// const PORT: string | undefined = process.env.LOCAL_PORT;
// if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
// mongoose.connect(process.env.MONGODB_URI).catch(console.error);

const app: Application = express();

app.use(cookieParser());
app.use(
  cors({
    origin: true, //VERCEL: changed from true to env
    credentials: true,
  }),
);
app.use(express.json());

connectDB().catch(console.error);

app.use(userRouter);
app.use(questRouter);
app.use(apiRouter);
// app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}!`);
// });

//! to run server -> nodemon index.ts, make sure all dependencies and modules are installed and it should work
export default app;