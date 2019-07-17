import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const AddUser = functions.auth
  .user()
  .onCreate((user: functions.auth.UserRecord, _: functions.EventContext) => {
    const newUser = {
      id: user.uid,
      name: user.displayName,
      photo: user.photoURL
    };
    return admin
      .firestore()
      .collection('users')
      .add(newUser);
  });
