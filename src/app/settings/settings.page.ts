import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit() {
    this.user$ = this.store.getUser();
  }

  onSignOut() {
    this.authService.auth
      .signOut()
      .then(() => this.router.navigate(['/tabs/map']));
  }

  copyToClipboard(id: string) {
    Plugins.Clipboard.write({ string: id });
  }
}
