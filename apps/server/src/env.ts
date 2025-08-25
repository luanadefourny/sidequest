const IS_SERVERLESS = !!process.env.VERCEL;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const PORT = process.env.LOCAL_PORT;
const OTM_KEY = process.env.OPENTRIPMAP_KEY;
const TM_KEY = process.env.TICKETMASTER_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT = process.env.FRONTEND_URL;

export {
  IS_SERVERLESS,
  DB_NAME,
  DB_PORT,
  PORT,
  OTM_KEY,
  TM_KEY,
  JWT_SECRET,
  MONGODB_URI,
  CLIENT,
}