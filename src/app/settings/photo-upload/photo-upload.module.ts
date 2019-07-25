import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { PhotoUploadPage } from './photo-upload.page';
import { PhotoUploadService } from './photo-upload.service';

const routes: Routes = [
  {
    path: '',
    component: PhotoUploadPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    AngularFireStorageModule
  ],
  declarations: [PhotoUploadPage],
  providers: [PhotoUploadService]
})
export class PhotoUploadPageModule {}
