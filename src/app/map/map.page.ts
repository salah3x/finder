import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Observable, Subject } from 'rxjs';

import { User } from '../shared/models';
import { StoreService } from '../shared/store.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage implements OnInit, AfterViewInit {
  myPosition: { lat: number; lng: number } = {
    lat: 33.4602523,
    lng: -7.5984837
  };
  center: { lat: number; lng: number };
  positionWatcher: string;
  user$: Observable<User>;
  friends$: Observable<User[]>;
  centerToMyPosition = true;
  searchTerm = new Subject<string>();
  loading = false;

  constructor(private store: StoreService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.user$ = this.store.getUser();
    this.friends$ = this.searchTerm.pipe(
      switchMap(s => this.store.getFriends(s)),
      tap(() => (this.loading = false))
    );
    this.route.queryParamMap.subscribe(params => {
      this.center = {
        lat: +params.get('latitude') || this.myPosition.lat,
        lng: +params.get('longitude') || this.myPosition.lng
      };
    });
  }

  ionViewWillEnter() {
    this.positionWatcher = Plugins.Geolocation.watchPosition(
      {},
      (position: Position) => {
        if (position) {
          this.myPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          if (this.centerToMyPosition) {
            this.center = { ...this.myPosition };
            this.centerToMyPosition = false;
          }
        }
      }
    );
  }

  ionViewDidLeave() {
    Plugins.Geolocation.clearWatch({ id: this.positionWatcher });
  }

  ngAfterViewInit() {
    this.search('');
  }

  search(s: string) {
    this.loading = true;
    this.searchTerm.next(s);
  }
}
