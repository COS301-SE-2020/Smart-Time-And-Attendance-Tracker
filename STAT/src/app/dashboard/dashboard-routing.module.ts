import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TodayComponent } from './today/today.component';
import { CalendarComponent } from './calendar/calendar.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { TeamsComponent } from './teams/teams.component';
import { HistoryComponent } from "./history/history.component";
import { AnalysisComponent } from "./analysis/analysis.component";
import { IOTComponent } from "./iot/iot.component";
import { UnauthorisedComponent } from "./unauthorised/unauthorised.component";

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'unauthorised', component: UnauthorisedComponent },
  { path: 'today', component: TodayComponent},
  { path: 'calendar', component: CalendarComponent},
  { path: 'iot', component: IOTComponent},
  { path: 'organisation', component: OrganisationComponent},
  { path: 'teams', component: TeamsComponent},
  { path: 'history', component: HistoryComponent },
  { path: 'analysis', component: AnalysisComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
