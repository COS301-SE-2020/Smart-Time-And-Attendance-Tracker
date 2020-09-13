import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MaterialComponentsModule } from 'src/app/material-components/material-components.module';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Unit tests', () => {
  describe('HistoryComponent', () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ HistoryComponent ],
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
        fixture = TestBed.createComponent(HistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));


    it('should be created', async(() => {
      fixture.whenStable().then(() => {
        expect(component).toBeTruthy();
      });
    }));
  });
});