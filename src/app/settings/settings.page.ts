import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
    private authService: AngularFireAuth
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
}
