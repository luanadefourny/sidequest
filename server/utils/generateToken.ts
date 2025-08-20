import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // token expires in 30 days
  });
};

export default generateToken;
