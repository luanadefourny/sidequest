type GeoPoint = {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
}

type User = {
  _id: string;
  username: string;
  email: string;
  // password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  isCurrent: boolean; //! to remove
  following: string[] | User[];
  followers: string[] | User[];
  profilePicture: string;
  myQuests: MyQuest[];
  myLocations: {
    label: string; //work
    name?: string; //Apple Southampton
    address?: string; //325 somethign road, SO15 1QE
    location: GeoPoint; //[lon, lat]
  }[];
}

type PublicUserData = {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

type Quest = {
  _id: string;
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

interface MyQuest {
  quest: string | Quest;
  isFavorite: boolean;
}

type QuestFilters = {
  type?: 'event' | 'place' | 'activity';
  ageRestricted?: '0' | '1';
  priceMin?: number | string;
  priceMax?: number | string;
  currency?: string;               // e.g. 'GBP' | 'EUR'
  startAfter?: string;             // ISO
  endBefore?: string;              // ISO
  near?: string;                   // "lon,lat"
  radius?: number | string;        // meters
  limit?: number;
};

export type { 
  User, 
  PublicUserData,
  Quest, 
  RegisterUserData, 
  LoginUserData,
  EditUserData, 
  Credentials,
  QuestFilters, 
  MyQuest,
}