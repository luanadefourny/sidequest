import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import path from 'path';

dotenv.config();
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
app.use(userRouter);
app.use(questRouter);
app.use(apiRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}!`);
});

//! to run server -> nodemon index.ts, make sure all dependencies and modules are installed and it should work
