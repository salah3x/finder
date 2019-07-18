export interface User {
  id: string;
  name: string;
  photo: string;
}

export interface Friendship {
  user1: string;
  user2: string;
  since: firebase.firestore.Timestamp;
}

export interface Request {
  from: string;
  to: string;
  accepted: boolean;
}
