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
import { AnalysisComponent } from './analysis/analysis.component';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { AngularFireModule } from "@angular/fire";
import { environment } from "../../environments/environment";
import {
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask} from "@angular/fire/storage";
import { ProfileComponent } from './profile/profile.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [MainComponent, TodayComponent, OrganisationComponent, ProjectsComponent, TeamsComponent, HistoryComponent, CalendarComponent, IOTComponent, UnauthorisedComponent, AnalysisComponent, ProfileComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialComponentsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud"),
    NgxSpinnerModule
  ]
})
export class DashboardModule { }
