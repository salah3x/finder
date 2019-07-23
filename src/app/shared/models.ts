export interface User {
  id: string;
  name: string;
  photo: string;
  offline?: boolean;
  friendship?: {
    id: string;
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
