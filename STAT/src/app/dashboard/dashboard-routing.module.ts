import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TodayComponent } from './today/today.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { TeamsComponent } from './teams/teams.component';


const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'today', component: TodayComponent},
  { path: 'organisation', component: OrganisationComponent},
  { path: 'teams', component: TeamsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
