// apps/server/api/index.ts
import { app } from "../src/app";
export const config = { runtime: "nodejs" }; // Node runtime for MongoDB
export default app; // Express as the handler