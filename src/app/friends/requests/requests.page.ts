import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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

  constructor(
    private storeService: StoreService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

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

  async acceptRequest(id: string, user: string) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you want to accept this request?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Accepting request...'
            });
            await loading.present();
            try {
              await this.storeService.acceptRequest(id, user);
            } catch (err) {
              console.error('Failed to accept request: ', err);
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async declineRequest(id: string, sentByMe: boolean) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: `Do you want to ${
        sentByMe ? 'cancel' : 'decline'
      } this request?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: `${sentByMe ? 'Canceling' : 'Declining'} request...`
            });
            await loading.present();
            try {
              await this.storeService.declineRequest(id);
            } catch (err) {
              console.error(
                `Failed to ${sentByMe ? 'cancel' : 'decline'} request: `,
                err
              );
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
