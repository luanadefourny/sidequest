import { Types } from 'mongoose';

type GeoPoint = {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
}

type User = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  isCurrent: boolean; //! to remove
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  profilePicture: string;
  favoriteQuests: Types.ObjectId[];
  favoriteLocations: {
    label: string;
    location: GeoPoint;
  }[];
}

type PublicUserData = {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

type Quest = {
  _id: Types.ObjectId;
  name: string;
  type: 'event' | 'place' | 'activity'; //! subject to change
  location: GeoPoint;
  ageRestricted: boolean;
  price?: number;
  currency?: string; // ISO 4217
  url?: string;
  startAt?: string;
  endAt?: string;
  description?: string;
  source?: string;
  sourceId?: string;
}

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
}

interface LoginUserData {
  username: string;
  password: string;
}

interface EditUserData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  birthday?: Date;
}

interface Credentials {
  username?: string;
  email?: string;
}

export type { 
  User, 
  PublicUserData,
  Quest, 
  RegisterUserData, 
  LoginUserData,
  EditUserData, 
  Credentials,
}