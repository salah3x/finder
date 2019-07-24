import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { FriendsPage } from './friends.page';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: 'requests',
    loadChildren: './requests/requests.module#RequestsPageModule'
  },
  {
    path: 'add',
    loadChildren: './add-friends/add-friends.module#AddFriendsPageModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
