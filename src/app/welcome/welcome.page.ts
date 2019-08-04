import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss']
})
export class WelcomePage {
  slideOpts = {
    speed: 500
  };

  constructor(private router: Router) {}

  async onStart() {
    await Plugins.Storage.set({ key: 'visited', value: 'true' });
    await this.router.navigate(['']);
  }
}
