import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  user$: Observable<firebase.User>;

  constructor(private authService: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.user$ = this.authService.user;
  }

  onSignOut() {
    this.authService.auth
      .signOut()
      .then(() => this.router.navigate(['/tabs/map']));
  }
}
