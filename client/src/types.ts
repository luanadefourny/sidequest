import type { ReactNode } from 'react';

type GeoPoint = {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
};
type Location = {
  longitude: string;
  latitude: string;
};

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
};

type AuthResponse = {
  user: User;
  token: string;
}

type PublicUserData = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  birthday: Date;
};

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
};

interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  profilePicture: string;
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

interface FavouriteButtonProps {
  questId: string;
  initialIsFavorite?: boolean;
}

type QuestFilters = {
  type?: 'event' | 'place' | 'activity';
  ageRestricted?: '0' | '1';
  priceMin?: number | string;
  priceMax?: number | string;
  currency?: string; // e.g. 'GBP' | 'EUR'
  startAfter?: string; // ISO
  endBefore?: string; // ISO
  near?: string; // "lon,lat"
  radius?: number | string; // meters
  limit?: number;
};

type ErrorBody = {
  error?: string;
  message?: string;
};

type LayoutProps = {
  children: ReactNode;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loggedIn: boolean;
};

interface HomePageProps {
  location: Location | null;
  setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
}
interface MapComponentProps {
  setLocation: (loc: { longitude: string; latitude: string }) => void;
  radius: number;
}
interface QuestsPageProps {
  quests: Quest[];
  myQuests: MyQuest[];
  setMyQuests: React.Dispatch<React.SetStateAction<MyQuest[]>>;
}
interface MyQuestsButtonProps {
  questId: string;
  myQuests: MyQuest[];
  setMyQuests: React.Dispatch<React.SetStateAction<MyQuest[]>>;
}
interface MyQuestsPageProps {
  myQuests: MyQuest[];
  setMyQuests: React.Dispatch<React.SetStateAction<MyQuest[]>>;
  myQuestsLoading: boolean;
}

type OpenTripMapPlace = {
  id: string;
  xid: string;
  name: string;
  kinds: string[];
  coords: { lat: number, lng: number };
  url?: string;
  source: 'opentripmap';
}

type OpenTripMapDetails = {
  address?: string;
  preview?: string;
  raw?: any;
}

export type {
  AuthResponse,
  Credentials,
  EditUserData,
  ErrorBody,
  FavouriteButtonProps,
  HomePageProps,
  LayoutProps,
  Location,
  LoginUserData,
  MapComponentProps,
  MyQuest,
  MyQuestsButtonProps,
  MyQuestsPageProps,
  OpenTripMapDetails,
  OpenTripMapPlace,
  PublicUserData,
  Quest,
  QuestFilters,
  QuestsPageProps,
  RegisterUserData,
  User,
  UserContextType,
};
