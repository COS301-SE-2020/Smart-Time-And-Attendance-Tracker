import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartupRoutingModule } from './startup-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FeaturesComponent } from './components/features/features.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MaterialComponentsModule } from '../material-components/material-components.module';


@NgModule({
  declarations: [HomeComponent, FeaturesComponent, DesktopComponent, SignUpComponent, SignInComponent],
  imports: [
    CommonModule,
    StartupRoutingModule,
    MaterialComponentsModule
  ],
  exports: [
    HomeComponent,
    FeaturesComponent,
    DesktopComponent,
    SignUpComponent,
    SignInComponent
  ]
})
export class StartupModule { }
