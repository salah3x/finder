import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { User, Friendship, Request } from './models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(
    private authService: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  getUser(): Observable<User | null> {
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
                    ? of([])
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
          : of([])
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

  getRequests() {
    return this.authService.user.pipe(
      switchMap(user =>
        user
          ? this.db
              .collection<Request>('requests', ref =>
                ref.where('to', '==', user.uid).orderBy('timestamp', 'desc')
              )
              .valueChanges({ idField: 'id' })
          : of([])
      ),
      switchMap(requests =>
        requests.length === 0
          ? of([])
          : combineLatest(
              requests.map(req =>
                this.db
                  .doc<User>(`users/${req.from}`)
                  .valueChanges()
                  .pipe(
                    map(
                      user =>
                        ({
                          ...user,
                          friendship: { id: req.id, date: req.timestamp }
                        } as User)
                    )
                  )
              )
            )
      )
    );
  }

  acceptRequest(request: Request) {}

  declineRequest(id: string) {}
}
