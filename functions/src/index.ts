import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

/**
 * Add a user document to firestore whenver a new user sign up
 */
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
        .catch(err => console.error('An error occured', err));
    }
  );

/**
 * Delete a user and all its associated data:
 * - Firebase auth user
 * - User document
 * - Any pending requests
 * - Any friendship records
 * - Image from cloud storage
 */
export const DeleteAccount = functions.https.onRequest(
  (req: functions.https.Request, res: functions.Response) => {
    return corsHandler(req, res, async () => {
      if (req.method !== 'DELETE') {
        res.status(405).send({ message: 'Method Not Allowed' });
        return;
      }
      if (!req.headers.authorization) {
        res.status(401).send({ message: 'Unautorized' });
        return;
      }
      let token: admin.auth.DecodedIdToken;
      try {
        token = await admin.auth().verifyIdToken(req.headers.authorization);
      } catch (error) {
        res.status(403).send({ message: 'Forbidden' });
        return;
      }
      try {
        await db.runTransaction(async tx => {
          const friendships = await tx.get(
            db
              .collection('friendships')
              .where('members', 'array-contains', token.uid)
          );
          const requestsFrom = await tx.get(
            db.collection('requests').where('from', '==', token.uid)
          );
          const requestsTo = await tx.get(
            db.collection('requests').where('to', '==', token.uid)
          );
          tx.delete(db.doc(`users/${token.uid}`));
          friendships.docs.forEach(doc => tx.delete(doc.ref));
          requestsFrom.docs.forEach(doc => tx.delete(doc.ref));
          requestsTo.docs.forEach(doc => tx.delete(doc.ref));
          const photo = admin
            .storage()
            .bucket()
            .file(`images/${token.uid}`);
          if ((await photo.exists())[0]) {
            await photo.delete();
          }
          await admin.auth().deleteUser(token.uid);
          res.status(200).send({ message: 'Account deleted' });
        });
      } catch (error) {
        console.error('Error deleting account: ', error);
        res.status(500).send({ message: 'Internal Error', error });
      }
    });
  }
);
