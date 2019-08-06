import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { User } from '../../shared/models';
import { StoreService } from '../../shared/store.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss']
})
export class AddFriendsPage implements OnInit, AfterViewInit {
  friends$: Observable<User[]>;
  searchTerm = new Subject<string>();
  loading = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private store: StoreService
  ) {}

  ngOnInit() {
    this.friends$ = this.searchTerm.pipe(
      switchMap(s => this.store.searchForFriends(s)),
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
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Send request',
          icon: 'person-add',
          handler: this.addFriend.bind(this, friend)
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

  private async addFriend(friend: User) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: `Do you want to send a request to ${friend.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel '
        },
        {
          text: 'Yes',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              message: `Sending request to ${friend.name}...`
            });
            await loader.present();
            if (!(await this.store.canSendRequest(friend.id))) {
              const alert2 = await this.alertCtrl.create({
                header: 'Error',
                message: `You are either friends with or already sent or received a request from ${
                  friend.name
                }`,
                buttons: [
                  {
                    text: 'Close',
                    role: 'cancel '
                  }
                ]
              });
              await loader.dismiss();
              await alert2.present();
              return;
            }
            try {
              await this.store.addFriend(friend.id);
            } catch (err) {
              console.error('Failed adding friend: ', err);
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
