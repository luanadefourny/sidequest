import { Types } from 'mongoose';

export type User = {
  _id: Types.ObjectId,
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  age: number,
  isCurrent: boolean,
}