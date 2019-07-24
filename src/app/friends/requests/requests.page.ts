import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { StoreService } from '../../shared/store.service';
import { User } from '../../shared/models';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss']
})
export class RequestsPage implements OnInit, AfterViewInit {
  users$: Observable<User[]>;
  search$ = new Subject<'from' | 'to'>();
  loading = false;

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.users$ = this.search$.pipe(
      switchMap(sent => this.storeService.getRequests(sent)),
      tap(() => (this.loading = false))
    );
  }

  ngAfterViewInit() {
    this.segmentChanged('to');
  }

  segmentChanged(sent: 'from' | 'to') {
    this.loading = true;
    this.search$.next(sent);
  }
}
