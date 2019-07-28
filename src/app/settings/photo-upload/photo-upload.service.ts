import { Injectable } from '@angular/core';
import { CameraPhoto } from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { throwError } from 'rxjs';
import {
  take,
  map,
  switchMap,
  takeLast,
  catchError,
  tap
} from 'rxjs/operators';

import { User } from '../../shared/models';

@Injectable()
export class PhotoUploadService {
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  async uploadPhoto(photo: CameraPhoto): Promise<void> {
    let userId: string;
    return this.auth.user
      .pipe(
        take(1),
        map(user => user.uid),
        tap(id => (userId = id)),
        switchMap(id =>
          this.storage
            .ref(`images/${id}`)
            .put(this.dataURItoBlob(photo.dataUrl))
            .snapshotChanges()
        ),
        takeLast(1),
        switchMap(snapshot => snapshot.ref.getDownloadURL()),
        switchMap((url: string) =>
          this.db.doc<User>(`users/${userId}`).update({ photo: url })
        ),
        catchError(err => {
          console.error('Upload failed: ', err);
          return throwError('Upload failed');
        })
      )
      .toPromise();
  }

  /**
   * Big thanks to this stackoverflow answer
   * https://stackoverflow.com/a/12300351/7004118
   */
  private dataURItoBlob(dataURI: string): Blob {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    const ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }
}
