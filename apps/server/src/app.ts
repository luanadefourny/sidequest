// apps/server/src/app.ts
import express from "express";
import cors from "cors";
import { db } from "./mongo";
import userRouter from "./routers/userRouter";
import questRouter from './routers/questRouter';
import apiRouter from './routers/apiRouter';
import { CLIENT } from "./env";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
  origin: CLIENT,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
// app.use((req, _res, next) => { console.log(req.method, req.originalUrl, req.query); next(); });//!REMOVE
app.use('/api', userRouter);
app.use('/api', questRouter);
app.use(apiRouter);

export { app }

// add more routes here (all must be prefixed with /api)