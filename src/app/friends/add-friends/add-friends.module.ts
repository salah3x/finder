import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AddFriendsPage } from './add-friends.page';

const routes: Routes = [
  {
    path: '',
    component: AddFriendsPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [AddFriendsPage]
})
export class AddFriendsPageModule {}
