import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, take, map } from 'rxjs/operators';

import { User, Friendship } from './models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(
    private authService: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  getUser() {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => this.db.doc<User>(`users/${user.uid}`).valueChanges())
    );
  }

  getFriends() {
    return this.authService.user.pipe(
      take(1),
      switchMap(user =>
        this.db
          .collection<Friendship>(`friendships`, ref =>
            ref.where('user1', '==', user.uid)
          )
          .valueChanges()
      ),
      map(docs => docs.map(doc => doc.user2)),
      switchMap(ids =>
        this.db
          .collection<User>('users', ref =>
            ref.where('id', 'array-contains', ids)
          )
          .valueChanges()
      )
    );
  }
}
