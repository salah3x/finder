import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';

import { User, Location } from '../shared/models';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage {
  myPosition: { lat: number; lng: number };
  positionWatcher: string;
  user$: Observable<User>;
  friends$: Observable<Location[]>;

  constructor(private store: StoreService) {}

  ionViewWillEnter() {
    this.positionWatcher = Plugins.Geolocation.watchPosition(
      {},
      (position: Position) => {
        if (position) {
          this.myPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        }
      }
    );
    this.user$ = this.store.getUser();
    this.friends$ = this.store.getFriendsWithLocations('');
  }

  ionViewDidLeave() {
    Plugins.Geolocation.clearWatch({ id: this.positionWatcher });
  }
}
