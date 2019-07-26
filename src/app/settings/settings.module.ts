import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'picture',
    loadChildren: () =>
      import('./photo-upload/photo-upload.module').then(
        m => m.PhotoUploadPageModule
      )
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
