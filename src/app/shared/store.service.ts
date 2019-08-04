import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import {
  combineLatest,
  of,
  Observable,
  throwError,
  Subscription,
  timer
} from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';

import { User, Friendship, Request, Location } from './models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private subs: Subscription;

  constructor(
    private authService: AngularFireAuth,
    private db: AngularFirestore,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  getUser(): Observable<User> {
    return this.authService.user.pipe(
      switchMap(user =>
        user
          ? this.db
              .doc<User>(`users/${user.uid}`)
              .valueChanges()
              .pipe(
                tap(u => {
                  if (u && !u.name) {
                    this.updateUsername(u.id, user.displayName);
                  }
                })
              )
          : of(null)
      )
    );
  }

  getFriends(search?: string): Observable<User[]> {
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
                ),
                switchMap(friends =>
                  friends.length === 0
                    ? of([] as User[])
                    : combineLatest(
                        friends.map(friend =>
                          this.db
                            .doc<Location>(`locations/${friend.id}`)
                            .valueChanges()
                            .pipe(
                              map(
                                location =>
                                  ({
                                    ...friend,
                                    location: {
                                      latitude: location.location.latitude,
                                      longitude: location.location.longitude,
                                      date: location.date
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
            u.name_lowercase.includes(search.trim().toLowerCase())
          );
        }
        return users;
      })
    );
  }

  async unFriend(id: string): Promise<void> {
    return this.db.doc(`friendships/${id}`).delete();
  }

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

  async declineRequest(id: string): Promise<void> {
    return this.db.doc<Request>(`requests/${id}`).delete();
  }

  searchForFriends(keyword: string): Observable<User[]> {
    keyword = keyword.trim().toLowerCase();
    return this.authService.user.pipe(
      switchMap(user =>
        !keyword
          ? of([] as User[])
          : this.db
              .collection<User>('users', ref =>
                ref
                  .orderBy('name_lowercase')
                  .startAt(keyword)
                  .endAt(keyword + '\uf8ff')
              )
              .valueChanges({ idField: 'id' })
              .pipe(map(users => users.filter(u => u.id !== user.uid)))
      )
    );
  }

  async addFriend(id: string): Promise<firestore.DocumentReference> {
    return this.authService.user
      .pipe(
        take(1),
        switchMap(user =>
          this.db.collection<Request>('requests').add({
            from: user.uid,
            to: id,
            timestamp: firestore.Timestamp.now()
          })
        )
      )
      .toPromise();
  }

  async canSendRequest(id: string): Promise<boolean> {
    return this.authService.user
      .pipe(
        take(1),
        switchMap(user =>
          combineLatest([
            this.db
              .collection('friendships', ref =>
                ref.where('members', '==', [user.uid, id])
              )
              .valueChanges(),
            this.db
              .collection('friendships', ref =>
                ref.where('members', '==', [id, user.uid])
              )
              .valueChanges(),
            this.db
              .collection('requests', ref =>
                ref.where('from', '==', id).where('to', '==', user.uid)
              )
              .valueChanges(),
            this.db
              .collection('requests', ref =>
                ref.where('to', '==', id).where('from', '==', user.uid)
              )
              .valueChanges()
          ]).pipe(
            take(1),
            map(
              docs =>
                docs[0]
                  .concat(docs[1])
                  .concat(docs[2])
                  .concat(docs[3]).length === 0
            )
          )
        )
      )
      .toPromise();
  }

  async updateUsername(id: string, name: string): Promise<void> {
    return this.db
      .doc<User>(`users/${id}`)
      .update({ name, name_lowercase: name.toLowerCase() });
  }

  async deleteAccount(): Promise<void> {
    return this.authService.idToken
      .pipe(
        take(1),
        switchMap(token =>
          this.http.delete<any>(`${environment.apiBaseUrl}/DeleteAccount`, {
            headers: { Authorization: token }
          })
        ),
        map(_ => {}),
        catchError(err => {
          console.error(err);
          return throwError(err.error.message || 'Unknown');
        })
      )
      .toPromise();
  }

  async setSharing(sharing: boolean): Promise<void> {
    return this.authService.user
      .pipe(
        take(1),
        switchMap(user =>
          this.db.doc<User>(`users/${user.uid}`).update({ isSharing: sharing })
        ),
        tap(() => {
          this.subs.unsubscribe();
          if (sharing) {
            this.startSharingMyLocation();
          }
        })
      )
      .toPromise();
  }

  startSharingMyLocation(): void {
    this.subs = this.getUser()
      .pipe(
        switchMap(user =>
          user && user.isSharing
            ? timer(0, 5000).pipe(
                switchMap(_ => Plugins.Geolocation.getCurrentPosition()),
                map(
                  location =>
                    ({
                      location: new firestore.GeoPoint(
                        location.coords.latitude,
                        location.coords.longitude
                      ),
                      date: firestore.Timestamp.now()
                    } as Location)
                ),
                switchMap(location =>
                  this.db.doc<Location>(`locations/${user.id}`).set(location)
                ),
                catchError(async err => {
                  await (await this.alertCtrl.create({
                    header: 'Error',
                    message: err.message || 'Unknown',
                    buttons: [{ text: 'Close', role: 'cancel' }]
                  })).present();
                  return of(null);
                })
              )
            : of(null)
        )
      )
      .subscribe();
  }
}
