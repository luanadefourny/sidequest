import express, { Application } from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter';
import questRouter from './routers/questRouter';
import apiRouter from './routers/apiRouter';
import cookieParser from "cookie-parser";

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, './.env') });

const PORT: string | undefined = process.env.LOCAL_PORT;


const app: Application = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(questRouter);
app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}!`);
});

//! to run server -> nodemon index.ts, make sure all dependencies and modules are installed and it should work