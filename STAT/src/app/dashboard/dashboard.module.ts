import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { MatIconModule } from '@angular/material/icon';
import { TodayComponent } from './today/today.component';
import { CalendarComponent } from './calendar/calendar.component';
import { IOTComponent } from './iot/iot.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { ProjectsComponent } from './projects/projects.component';
import { TeamsComponent } from './teams/teams.component';
import { HistoryComponent } from './history/history.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [MainComponent, TodayComponent, OrganisationComponent, ProjectsComponent, TeamsComponent, HistoryComponent, CalendarComponent, IOTComponent, UnauthorisedComponent, ProfileComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule
  ]
})
export class DashboardModule { }
