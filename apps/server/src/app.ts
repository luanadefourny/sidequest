import express from "express";
import cors from "cors";
import { connectDB } from "./mongo";
import userRouter from "./routers/userRouter";
import questRouter from './routers/questRouter';
import apiRouter from './routers/apiRouter';
import { CLIENT, IS_SERVERLESS } from "./env";
import cookieParser from 'cookie-parser';

const app = express();
if (!IS_SERVERLESS) app.use(cors({
    origin: CLIENT,
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

connectDB().catch((e) => {
  console.error('DB connect failed at boot: ', e?.message);
});

app.use('/api', userRouter);
app.use('/api', questRouter);
app.use(apiRouter);

export { app }
