// apps/server/src/index.ts
// import dotenv from 'dotenv';
// import dotenv f0.....................rom 'dotenv';
import { app } from './app';
// import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
// import mongoose from 'mongoose';
import path from 'path';
// import 'dotenv/config';
import { PORT, CLIENT } from './env';


// import { connectDB } from './db';
// dotenv.config({ path: path.resolve(__dirname, '../../.env')}); //TODO change where it comes from
// dotenv.config();
import apiRouter from './routers/apiRouter';
import questRouter from './routers/questRouter';
import userRouter from './routers/userRouter';


// const app: Application = express();

// app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT,
    credentials: true, // allow cookies
  }),
);
// app.use(express.json());

// app.use(userRouter);
// app.use(questRouter);
// app.use(apiRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}!`);
});

