import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ActionSheetController
} from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { StoreService } from '../shared/store.service';
import { User } from '../shared/models';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss']
})
export class FriendsPage implements OnInit, AfterViewInit {
  friends$: Observable<User[]>;
  searchTerm = new Subject<string>();
  loading = false;

  constructor(
    private store: StoreService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  ngOnInit() {
    this.friends$ = this.searchTerm.pipe(
      switchMap(s => this.store.getFriends(s)),
      tap(() => (this.loading = false))
    );
  }

  ngAfterViewInit() {
    this.search('');
  }

  search(s: string) {
    this.loading = true;
    this.searchTerm.next(s);
  }

  async showActionSheet(friend: User) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Find on Map',
          icon: 'pin',
          handler: async () => {
            if (!friend.location) {
              (await this.alertCtrl.create({
                header: `Couldn't find location`,
                message: `${friend.name} is not sharing location.`,
                buttons: [{ text: 'Close', role: 'cancel' }]
              })).present();
              return;
            }
            return this.router.navigate(['tabs', 'map'], {
              queryParams: {
                latitude: friend.location.latitude,
                longitude: friend.location.longitude
              }
            });
          }
        },
        {
          text: 'Unfriend',
          role: 'destructive',
          icon: 'trash',
          handler: this.unFriend.bind(this, friend)
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private async unFriend(friend: User) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: `Do you want to unfriend ${friend.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel '
        },
        {
          text: 'Yes',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              message: `Unfriending ${friend.name}...`
            });
            await loader.present();
            try {
              await this.store.unFriend(friend.friendship.id);
            } catch (err) {
              console.error('Unfriending failed: ', err);
            } finally {
              await loader.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
