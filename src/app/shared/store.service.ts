import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { combineLatest, of, Observable } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';

import { User, Friendship, Request } from './models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(
    private authService: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  getUser(): Observable<User> {
    return this.authService.user.pipe(
      switchMap(user =>
        user ? this.db.doc<User>(`users/${user.uid}`).valueChanges() : of(null)
      )
    );
  }

  getFriends(search?: string) {
    return this.authService.user.pipe(
      switchMap(user =>
        user
          ? this.db
              .collection<Friendship>(`friendships`, ref =>
                ref.where('members', 'array-contains', user.uid)
              )
              .valueChanges({ idField: 'id' })
              .pipe(
                map(docs =>
                  docs.map(doc => ({
                    id: doc.members.filter(e => e !== user.uid)[0],
                    friendship: {
                      id: doc.id,
                      date: doc.since
                    }
                  }))
                ),
                switchMap(friends =>
                  friends.length === 0
                    ? of([] as User[])
                    : combineLatest(
                        friends.map(friend =>
                          this.db
                            .doc<User>(`users/${friend.id}`)
                            .valueChanges()
                            .pipe(
                              map(
                                u =>
                                  ({
                                    ...u,
                                    friendship: {
                                      ...friend.friendship
                                    }
                                  } as User)
                              )
                            )
                        )
                      )
                )
              )
          : of([] as User[])
      ),
      map(users => {
        if (search && search.trim()) {
          return users.filter(u =>
            u.name.toLowerCase().includes(search.trim().toLowerCase())
          );
        }
        return users;
      })
    );
  }

  unFriend(id: string) {
    return this.db.doc(`friendships/${id}`).delete();
  }

  addFriend(id: string) {}

  /**
   * If field === 'form', the method return the list of sent requests,
   * else it returns the list of received ones.
   *
   * @param field The field that shoud match the logged in user id
   */
  getRequests(field: 'from' | 'to'): Observable<User[]> {
    return this.authService.user.pipe(
      switchMap(user =>
        user
          ? this.db
              .collection<Request>('requests', ref =>
                ref.where(field, '==', user.uid).orderBy('timestamp', 'desc')
              )
              .valueChanges({ idField: 'id' })
              .pipe(
                switchMap(requests =>
                  requests.length === 0
                    ? of([] as User[])
                    : combineLatest(
                        requests.map(req =>
                          this.db
                            .doc<User>(
                              `users/${field === 'from' ? req.to : req.from}`
                            )
                            .valueChanges()
                            .pipe(
                              map(
                                u =>
                                  ({
                                    ...u,
                                    request: {
                                      id: req.id,
                                      date: req.timestamp,
                                      sentByMe: field === 'from'
                                    }
                                  } as User)
                              )
                            )
                        )
                      )
                )
              )
          : of([] as User[])
      )
    );
  }

  async acceptRequest(id: string, user: string): Promise<void> {
    const u = await this.authService.user.pipe(take(1)).toPromise();
    return await this.db.firestore
      .batch()
      .set(this.db.doc<Friendship>(`friendships/${this.db.createId()}`).ref, {
        since: firestore.Timestamp.now(),
        members: [u.uid, user]
      } as Friendship)
      .delete(this.db.doc<Request>(`requests/${id}`).ref)
      .commit();
  }

  declineRequest(id: string): Promise<void> {
    return this.db.doc<Request>(`requests/${id}`).delete();
  }
}
