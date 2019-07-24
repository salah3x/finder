import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PhotoUploadPage } from './photo-upload.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoUploadPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [PhotoUploadPage]
})
export class PhotoUploadPageModule {}
