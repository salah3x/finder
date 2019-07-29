import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { MapPage } from './map.page';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
    }),
    RouterModule.forChild([{ path: '', component: MapPage }])
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
