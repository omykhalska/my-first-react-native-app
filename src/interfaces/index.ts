import { Timestamp } from 'firebase/firestore'

export interface UserCredentials {
  email: string;
  password: string;
  login?: string;
}

export interface IUser {
  userAvatar: string,
  userEmail: string,
  userId: string,
  userName: string
}

export interface IPost {
  address: string;
  comments: number;
  createdAt: Timestamp;
  id: string;
  likes: Array<string>;
  location: null | Map<string, number>;
  photo: string;
  title: string;
  userAvatar?: string;
  userId: string;
  userName?: string;
}

export interface IComment {
  commentText: string;
  createdAt: Timestamp;
  id: string;
  userAvatar: string;
  userId: string;
}

export interface ICoords {
  latitude: number;
  longitude: number;
}
 