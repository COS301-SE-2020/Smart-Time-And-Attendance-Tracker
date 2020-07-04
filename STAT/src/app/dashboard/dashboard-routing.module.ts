import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TodayComponent } from './today/today.component';


const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'today', component: TodayComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
