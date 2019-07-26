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
    loadChildren: () =>
      import('./requests/requests.module').then(m => m.RequestsPageModule)
  },
  {
    path: 'add',
    loadChildren: () =>
      import('./add-friends/add-friends.module').then(
        m => m.AddFriendsPageModule
      )
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
