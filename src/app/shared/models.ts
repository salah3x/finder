export interface User {
  id: string;
  name: string;
  name_lowercase: string;
  photo: string;
  isSharing: boolean;
  friendship?: {
    id: string;
    date: firebase.firestore.Timestamp;
  };
  request?: {
    id: string;
    date: firebase.firestore.Timestamp;
    sentByMe: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
    date: firebase.firestore.Timestamp;
  };
}

export interface Friendship {
  members: string[];
  since: firebase.firestore.Timestamp;
}

export interface Request {
  from: string;
  to: string;
  timestamp: firebase.firestore.Timestamp;
}

export interface Location {
  location: firebase.firestore.GeoPoint;
  date: firebase.firestore.Timestamp;
}
