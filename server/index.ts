// import dotenv from 'dotenv';
import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { connectDB } from './db';
// dotenv.config({ path: path.resolve(__dirname, '../.env')}); //TODO change where it comes from
import apiRouter from './routers/apiRouter';
import questRouter from './routers/questRouter';
import userRouter from './routers/userRouter';

const PORT: string | undefined = process.env.LOCAL_PORT;

const app: Application = express();

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow cookies
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  const { readyState, name, host, port } = mongoose.connection as any;
  res.status(200).json({
    ok: true,
    mongo: { connected: readyState === 1, readyState, name, host, port },
    time: new Date().toISOString(),
  });
});

connectDB()
  .then(() => console.log('[server] DB ready'))
  .catch((e) => console.error('[server] DB failed', e));

app.use(userRouter);
app.use(questRouter);
app.use(apiRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}!`);
});

