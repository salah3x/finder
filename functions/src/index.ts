import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: 'http://localhost:8100' });

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

export const DeleteAccount = functions.https.onRequest(
  async (req: functions.https.Request, res: functions.Response) => {
    // tslint:disable-next-line: no-empty
    corsHandler(req, res, () => {});
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
    return db
      .runTransaction(async tx => {
        tx.delete(db.doc(`users/${token.uid}`));
        const friendships = await tx.get(
          db
            .collection('friendships')
            .where('members', 'array-contains', token.uid)
        );
        friendships.docs.forEach(doc => tx.delete(doc.ref));
        const requestsFrom = await tx.get(
          db.collection('requests').where('from', '==', token.uid)
        );
        requestsFrom.docs.forEach(doc => tx.delete(doc.ref));
        friendships.docs.forEach(doc => tx.delete(doc.ref));
        const requestsTo = await tx.get(
          db.collection('requests').where('to', '==', token.uid)
        );
        requestsTo.docs.forEach(doc => tx.delete(doc.ref));
        await admin.auth().deleteUser(token.uid);
        await admin
          .storage()
          .bucket()
          .file(`images/${token.uid}`)
          .delete();
      })
      .then(() => res.status(200).send({ message: 'Account deleted' }))
      .catch(err => {
        console.error('Error deleting account: ', err);
        res.status(500).send({ message: 'Internal Error', error: err });
      });
  }
);
