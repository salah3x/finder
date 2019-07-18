import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [IonicModule, CommonModule, TabsPageRoutingModule],
  declarations: [TabsPage]
})
export class TabsPageModule {}
