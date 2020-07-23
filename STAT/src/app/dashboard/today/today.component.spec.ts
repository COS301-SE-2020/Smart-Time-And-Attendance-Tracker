import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TodayComponent } from './today.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserModule, By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { of } from 'rxjs';
import { TrackingService } from 'src/app/shared/services/tracking.service';

describe('Unit tests', () => {
describe('TodayComponent', () => {
  let component: TodayComponent;
  let fixture: ComponentFixture<TodayComponent>;
  let de: DebugElement;
  let el: HTMLElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
        ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(TodayComponent);

      component = fixture.componentInstance;

      fixture.detectChanges();
      el = de.nativeElement;
      component.autoTracking=false;
    });
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should call the open method when the add button is pressed', async(() => {
    component.autoTracking=false;
    spyOn(component,'open');
    el = fixture.debugElement.query(By.css(".start-tracking")).nativeElement;
    el.click();
    expect(component.open).toHaveBeenCalledTimes(1);
  }));

  it("should call the addManualEntry method when the 'Create an Entry' button is pressed", async(() => {
    component.autoTracking=false;
    spyOn(component,'addManualEntry');
    el = fixture.debugElement.query(By.css("#m-tracking")).nativeElement;
    el.click();
    expect(component.addManualEntry).toHaveBeenCalledTimes(1);
  }));


  // **************************
    // INVALID MANUAL TRACKING FORM TESTS
    // **************************
    describe('Manual Tracking Form', () => {
      it('should be invalid with empty details', async(() => {
        component.autoTracking=false;
        component.manualTrackingForm.controls['Description'].setValue('');
        component.manualTrackingForm.controls['Project'].setValue('');
        component.manualTrackingForm.controls['TaskID'].setValue('');
        component.manualTrackingForm.controls['Date'].setValue('');
        component.manualTrackingForm.controls['StartTime'].setValue('');
        component.manualTrackingForm.controls['EndTime'].setValue('');
        expect(component.manualTrackingForm.valid).toBeFalsy();
        expect(component.manualTrackingForm.controls.email.hasError('Project')).toBe(true);
        expect(component.manualTrackingForm.controls.password.hasError('TaskID')).toBe(true);
        expect(component.manualTrackingForm.controls.email.hasError('Date')).toBe(true);
        expect(component.manualTrackingForm.controls.password.hasError('StartTime')).toBe(true);
        expect(component.manualTrackingForm.controls.passwordConf.hasError('EndTime')).toBe(true);
      }));
      it('should be valid with correct details', async(() => {
        component.autoTracking=false;
        component.manualTrackingForm.controls['Description'].setValue('Manual entry');
        component.manualTrackingForm.controls['Project'].setValue('5f12ed1495236d59d08bc98d');
        component.manualTrackingForm.controls['TaskID'].setValue('84153a223dgadfh056af1g0');
        component.manualTrackingForm.controls['Date'].setValue('2020/07/22');
        component.manualTrackingForm.controls['StartTime'].setValue("15:30");
        component.manualTrackingForm.controls['EndTime'].setValue("16:42");
        expect(component.manualTrackingForm.valid).toBeTruthy();
        expect(component.manualTrackingForm.controls.email.hasError('Project')).toBeFalsy();
        expect(component.manualTrackingForm.controls.password.hasError('TaskID')).toBeFalsy();
        expect(component.manualTrackingForm.controls.email.hasError('Date')).toBeFalsy();
        expect(component.manualTrackingForm.controls.password.hasError('StartTime')).toBeFalsy();
        expect(component.manualTrackingForm.controls.passwordConf.hasError('EndTime')).toBeFalsy();
      }));
    });
    // ****************************************** END

    // **************************
    // INVALID AUTOMATIC TRACKING FORM TESTS
    // **************************
    describe('Automatic Tracking Form', () => {
      component.autoTracking=true;
      it('should be invalid with empty details', async(() => {
        component.automaticTrackingForm.controls['Description'].setValue('');
        component.automaticTrackingForm.controls['Project'].setValue('');
        component.automaticTrackingForm.controls['TaskID'].setValue('');
        expect(component.automaticTrackingForm.valid).toBeFalsy();
        expect(component.automaticTrackingForm.controls.email.hasError('Project')).toBe(true);
        expect(component.automaticTrackingForm.controls.password.hasError('TaskID')).toBe(true);
      }));
      it('should be valid with correct details', async(() => {
        component.autoTracking=false;
        component.automaticTrackingForm.controls['Description'].setValue('Timed entry');
        component.automaticTrackingForm.controls['Project'].setValue('5f12ed1495236d59d08bc98d');
        component.automaticTrackingForm.controls['TaskID'].setValue('84153a223dgadfh056af1g0');
        expect(component.automaticTrackingForm.valid).toBeTruthy();
        expect(component.automaticTrackingForm.controls.email.hasError('Project')).toBeFalsy();
        expect(component.automaticTrackingForm.controls.password.hasError('TaskID')).toBeFalsy();
      }));

    });
    // ****************************************** END
});
});
describe('Integration tests:', () => {
  describe('TodayComponent', () => {

    let component: TodayComponent;
    let fixture: ComponentFixture<TodayComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let ACService;
    let TService;
    let router: Router;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ TodayComponent ],
        imports:
        [
          BrowserModule,
          FormsModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
       providers: [
        {provide: TodayComponent},
        {provide: TrackingService}]
      })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(TodayComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
        ACService = TestBed.get(AccountManagementService);
        TService = TestBed.get(TrackingService);

      });
    }));

  describe('addManualEntry()', () => {

    it('should call addMTimeEntry function from the TrackingSevice', async(() => {
      component.autoTracking=false;
      component.manualTrackingForm.controls['Description'].setValue('');
        component.manualTrackingForm.controls['Project'].setValue('');
        component.manualTrackingForm.controls['TaskID'].setValue('');
        component.manualTrackingForm.controls['Date'].setValue('');
        component.manualTrackingForm.controls['StartTime'].setValue('');
        component.manualTrackingForm.controls['EndTime'].setValue('');
      spyOn(TService, 'addMTimeEntry')

      component.addManualEntry( component.manualTrackingForm.value);
      fixture.detectChanges();

      expect(component.service.addMTimeEntry).toHaveBeenCalledTimes(1);
    }));

    });
});
});