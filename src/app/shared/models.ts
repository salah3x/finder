export interface User {
  id: string;
  name: string;
  photo: string;
  friendship?: {
    id: string;
    date: firebase.firestore.Timestamp;
  };
  request?: {
    id: string;
    date: firebase.firestore.Timestamp;
    sentByMe: boolean;
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
