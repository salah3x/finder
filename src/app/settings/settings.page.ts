import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';

import { User } from '../shared/models';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  user$: Observable<User>;

  constructor(
    private store: StoreService,
    private authService: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.user$ = this.store.getUser();
  }

  onSignOut() {
    this.authService.auth
      .signOut()
      .then(() => this.navCtrl.navigateBack(['/tabs/map']));
  }

  copyToClipboard(id: string) {
    Plugins.Clipboard.write({ string: id });
  }
}
