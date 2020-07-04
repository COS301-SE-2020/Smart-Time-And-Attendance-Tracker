import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { MatIconModule } from '@angular/material/icon';
import { TodayComponent } from './today/today.component';


@NgModule({
  declarations: [MainComponent, TodayComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialComponentsModule
  ]
})
export class DashboardModule { }
