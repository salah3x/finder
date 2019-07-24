import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../shared/models';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  user$: Observable<User>;
  isCopying = false;
  loading = false;

  constructor(
    private store: StoreService,
    private authService: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loading = true;
    this.user$ = this.store.getUser().pipe(tap(() => (this.loading = false)));
  }

  onSignOut() {
    this.authService.auth.signOut();
  }

  copyToClipboard(id: string) {
    this.isCopying = true;
    Plugins.Clipboard.write({ string: id }).then(() =>
      setTimeout(() => (this.isCopying = false), 750)
    );
  }

  async onChangeName(id: string, name: string) {
    const alert = await this.alertCtrl.create({
      header: 'Type your name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: name,
          placeholder: 'Type your name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Save',
          handler: async result => {
            const loading = await this.loadingCtrl.create({
              message: 'Updating your name...'
            });
            await loading.present();
            try {
              await this.store.updateUsername(id, result.name);
            } catch (err) {
              console.error('Failed to update username: ', err);
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
