import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { FriendsPage } from './friends.page';
import { TimeAgoPipe } from '../shared/time-ago.pipe';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: 'requests',
    loadChildren: './requests/requests.module#RequestsPageModule'
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [FriendsPage, TimeAgoPipe]
})
export class FriendsPageModule {}
