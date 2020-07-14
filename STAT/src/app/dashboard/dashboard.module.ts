import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { MatIconModule } from '@angular/material/icon';
import { TodayComponent } from './today/today.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { ProjectsComponent } from './projects/projects.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [MainComponent, TodayComponent, OrganisationComponent, ProjectsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialComponentsModule,
    NgbModule
  ]
})
export class DashboardModule { }
