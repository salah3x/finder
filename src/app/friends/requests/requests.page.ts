import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StoreService } from '../../shared/store.service';
import { User } from '../../shared/models';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss']
})
export class RequestsPage implements OnInit {
  users$: Observable<User[]>;
  loading = false;

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.loading = true;
    this.users$ = this.storeService
      .getRequests()
      .pipe(tap(() => (this.loading = false)));
  }
}
