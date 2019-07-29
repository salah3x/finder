import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';

import { User } from '../shared/models';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage implements OnInit {
  myPosition: { lat: number; lng: number } = {
    lat: 33.4602523,
    lng: -7.5984837
  };
  center: { lat: number; lng: number };
  user$: Observable<User>;
  friends$: Observable<User[]>;

  constructor(private store: StoreService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.user$ = this.store.getUser();
    this.friends$ = this.store.getFriends('');
    this.route.queryParamMap.subscribe(params => {
      this.center = {
        lat: +params.get('latitude') || this.myPosition.lat,
        lng: +params.get('longitude') || this.myPosition.lng
      };
    });
    let centerToMyPosition = true;
    Plugins.Geolocation.watchPosition({}, (position: Position) => {
      if (position) {
        this.myPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (centerToMyPosition) {
          this.center = { ...this.myPosition };
          centerToMyPosition = false;
        }
      }
    });
  }
}
