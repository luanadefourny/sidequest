import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env';

const generateToken = (userId: string): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d', // token expires in 30 days
  });
};

export default generateToken;
