import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, LoadingController, IonToggle } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';

import { User } from '../shared/models';
import { StoreService } from '../shared/store.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  user$: Observable<User | { offline: boolean }>;
  isCopying = false;
  echoing = false;

  constructor(
    private store: StoreService,
    private authService: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.user$ = this.store
      .getUser()
      .pipe(map(u => (u ? u : { offline: true })));
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
          role: 'cancel'
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

  async onDeleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'This will delete all your data permanently',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              message: 'Deleting account...'
            });
            await loader.present();
            try {
              await this.store.deleteAccount();
              await this.onSignOut();
              await loader.dismiss();
            } catch (err) {
              await loader.dismiss();
              await (await this.alertCtrl.create({
                header: 'Error',
                message: err,
                buttons: [{ text: 'Close', role: 'cancel' }]
              })).present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async onChangeSharing(toggle: IonToggle) {
    if (this.echoing) {
      this.echoing = false;
      return;
    }
    const loader = await this.loadingCtrl.create({
      message: 'Saving changes...'
    });
    await loader.present();
    try {
      await this.store.setSharing(toggle.checked);
      await loader.dismiss();
    } catch (_) {
      this.echoing = true;
      toggle.checked = !toggle.checked;
      await loader.dismiss();
      await (await this.alertCtrl.create({
        header: 'Error',
        message: 'Please try again later',
        buttons: [{ text: 'Close', role: 'cancel' }]
      })).present();
    }
  }
}
