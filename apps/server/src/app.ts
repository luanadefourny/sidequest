// apps/server/src/app.ts
import express from "express";
import cors from "cors";
import { connectDB } from "./mongo";
import userRouter from "./routers/userRouter";
import questRouter from './routers/questRouter';
import apiRouter from './routers/apiRouter';
import { CLIENT, IS_SERVERLESS } from "./env";
import cookieParser from 'cookie-parser';
import { authenticateJWT } from "./middleware/authMiddleware";
import type { AuthenticatedRequest } from "./middleware/authMiddleware";


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

app.get("/api/health", (_req, res) => res.json({ ok: true }));
// app.use((req, _res, next) => { console.log(req.method, req.originalUrl, req.query); next(); });//!REMOVE

// add once in app.ts before routers
app.use((req,_res,next)=>{ console.log("HIT", req.method, req.originalUrl); next(); });
app.get("/whoami", authenticateJWT, (req: AuthenticatedRequest ,res)=>res.json({ user: req.user }));


app.use('/api', userRouter);
app.use('/api', questRouter);
app.use(apiRouter);

export { app }

// add more routes here (all must be prefixed with /api)