import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Plugins, CameraResultType } from '@capacitor/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../../shared/models';
import { StoreService } from '../../shared/store.service';
import { PhotoUploadService } from './photo-upload.service';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.page.html',
  styleUrls: ['./photo-upload.page.scss']
})
export class PhotoUploadPage implements OnInit {
  user$: Observable<User>;
  loading = false;

  constructor(
    private store: StoreService,
    private upload: PhotoUploadService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loading = true;
    this.user$ = this.store.getUser().pipe(tap(() => (this.loading = false)));
  }

  async onChooseImage() {
    const loader = await this.loadingCtrl.create({ message: 'Uploading...' });
    try {
      const photo = await Plugins.Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
      });
      await loader.present();
      await this.upload.uploadPhoto(photo);
      await loader.dismiss();
    } catch (err) {
      await loader.dismiss();
      await (await this.alertCtrl.create({
        header: 'Error',
        message: err.message || err,
        buttons: [{ text: 'Close', role: 'cancel' }]
      })).present();
    }
  }
}
