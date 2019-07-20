import { Component, OnInit } from '@angular/core';
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
  isCopying = false;

  constructor(
    private store: StoreService,
    private authService: AngularFireAuth
  ) {}

  ngOnInit() {
    this.user$ = this.store.getUser();
  }

  onSignOut() {
    this.authService.auth.signOut();
  }

  copyToClipboard(id: string) {
    this.isCopying = true;
    Plugins.Clipboard.write({ string: id }).then(() =>
      setTimeout(() => (this.isCopying = false), 500)
    );
  }
}
