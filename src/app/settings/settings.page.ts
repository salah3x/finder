import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  constructor(private authService: AngularFireAuth, private router: Router) {}

  ngOnInit() {}

  onSignOut() {
    this.authService.auth
      .signOut()
      .then(() => this.router.navigate(['/tabs/map']));
  }
}
