import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  user$: Observable<string>;

  constructor(
    private navCtrl: NavController,
    private authService: AngularFireAuth
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user.pipe(
      map(user => (user ? user.displayName : ''))
    );
  }

  successCallback() {
    this.navCtrl.navigateForward('/tabs/settings');
  }
}
