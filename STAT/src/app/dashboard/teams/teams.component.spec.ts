import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamsComponent } from './teams.component';
import { HttpClientTestingModule, HttpTestingController  } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MaterialComponentsModule } from 'src/app/material-components/material-components.module';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
          MaterialComponentsModule,
          MatCardModule,
          BrowserAnimationsModule
        ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});