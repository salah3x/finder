import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const AddUser = functions.auth
  .user()
  .onCreate(
    async (user: functions.auth.UserRecord, ctx: functions.EventContext) => {
      if (
        !(await db
          .collection('users')
          .where('eventId', '==', ctx.eventId)
          .get()
          .then(docs => docs.empty))
      ) {
        return;
      }
      const newUser = {
        id: user.uid,
        name: user.displayName || '',
        name_lowercase: user.displayName ? user.displayName.toLowerCase() : '',
        photo: user.photoURL || '',
        eventId: ctx.eventId
      };
      return db
        .collection('users')
        .doc(user.uid)
        .set(newUser)
        .then(() => console.log('User saved to database'))
        .catch(err => console.error('An error occured', err));
    }
  );

export const DeleteUser = functions.auth
  .user()
  .onDelete((user: functions.auth.UserRecord, _: functions.EventContext) =>
    db
      .doc(`users/${user.uid}`)
      .delete()
      .then(() => console.log('User deleted'))
      .catch(err => console.error('An error occured', err))
  );
