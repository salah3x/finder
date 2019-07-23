import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';

import { User, Friendship, Request } from './models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private offlineUser: BehaviorSubject<User>;
  private offlineFriends: BehaviorSubject<User[]>;

  constructor(
    private authService: AngularFireAuth,
    private db: AngularFirestore
  ) {
    const randomId = db.createId();
    this.offlineUser = new BehaviorSubject<User>({
      id: randomId,
      name: 'Guest_' + randomId.slice(0, 4),
      photo: '',
      offline: true
    });
    this.offlineFriends = new BehaviorSubject<User[]>([
      {
        id: '123',
        name: 'salah',
        photo: '',
        friendship: { id: '5645', date: firestore.Timestamp.now() }
      },
      {
        id: '1234',
        name: 'Test',
        photo: '',
        friendship: { id: '9842', date: firestore.Timestamp.now() }
      }
    ]);
  }

  getUser() {
    return this.authService.user.pipe(
      switchMap(user =>
        user
          ? this.db.doc<User>(`users/${user.uid}`).valueChanges()
          : this.offlineUser.asObservable()
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
          : this.offlineFriends.asObservable()
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
    return this.authService.user.pipe(
      take(1),
      switchMap(user =>
        user
          ? this.db.doc(`friendships/${id}`).delete()
          : this.offlineFriends.pipe(
              take(1),
              tap(friends =>
                this.offlineFriends.next(
                  friends.filter(f => f.friendship.id !== id)
                )
              ),
              map(() => {})
            )
      )
    );
  }

  addFriend(id: string) {}

  getRequests() {
    return this.authService.user.pipe(
      switchMap(user =>
        this.db
          .collection<Request>('requests', ref =>
            ref.where('to', '==', user.uid).orderBy('timestamp', 'desc')
          )
          .valueChanges({ idField: 'id' })
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
