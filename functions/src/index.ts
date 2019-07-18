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
      console.log(user);
      const newUser = {
        id: user.uid,
        name: user.displayName,
        photo: user.photoURL,
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
