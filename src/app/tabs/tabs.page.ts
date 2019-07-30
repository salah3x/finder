import { Component, OnInit } from '@angular/core';

import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  constructor(private store: StoreService) {}

  ngOnInit() {
    this.store.startSharingMyLocation();
  }
}
