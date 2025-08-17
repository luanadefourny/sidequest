import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(403).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
