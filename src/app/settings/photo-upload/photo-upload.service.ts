import { Injectable } from '@angular/core';
import { CameraPhoto } from '@capacitor/core';
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

import { StoreService } from '../../shared/store.service';

@Injectable()
export class PhotoUploadService {
  constructor(
    public store: StoreService,
    private storage: AngularFireStorage
  ) {}

  uploadPhoto(photo: CameraPhoto): Promise<void> {
    let userId: string;
    return this.store
      .getUser()
      .pipe(
        take(1),
        map(user => user.id),
        tap(id => (userId = id)),
        switchMap(id =>
          this.storage
            .ref(`images/${id}.${photo.format}`)
            .put(this.dataURItoBlob(photo.dataUrl))
            .snapshotChanges()
        ),
        takeLast(1),
        switchMap(snapshot => snapshot.ref.getDownloadURL()),
        catchError(err => {
          console.error('Upload failed: ', err);
          return throwError('Upload failed');
        }),
        switchMap((url: string) => this.store.updatePhoto(userId, url))
      )
      .toPromise();
  }

  /**
   * Big thanks to this stackoverflow answer
   * https://stackoverflow.com/a/12300351/7004118
   */
  private dataURItoBlob(dataURI) {
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
