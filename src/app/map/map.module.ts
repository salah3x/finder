import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { MapPage } from './map.page';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
    }),
    RouterModule.forChild([{ path: '', component: MapPage }])
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
