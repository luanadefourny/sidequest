import { Types } from 'mongoose';

type User = {
  _id: Types.ObjectId,
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  age: number,
  isCurrent: boolean,
}

interface RegisterUserData {
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  age: number,
}

interface LoginUserData {
  username: string,
  password: string,
}

export type { User, RegisterUserData, LoginUserData }