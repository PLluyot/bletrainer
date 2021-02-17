import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
//charts
import { ChartsModule } from 'ng2-charts';
import {TarjetaComponent} from '../tarjeta/tarjeta.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ChartsModule
  ],
  declarations: [HomePage,TarjetaComponent],
  entryComponents: [TarjetaComponent]
})
export class HomePageModule {}
