
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { OrganisationComponent } from './organisation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { Observable, of, throwError } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('Unit tests:', () => {
  describe('OrganisationComponent', () => {

    let component: OrganisationComponent;
    let fixture: ComponentFixture<OrganisationComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let requests;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ OrganisationComponent ],
        imports:
        [
          BrowserModule,
          FormsModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule,
          SharedModule,
          MatMenuModule,
          MatIconModule,
          MatCardModule
        ]
      })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(OrganisationComponent);
        requests = [{ 'ID': "5f18ab456876e757b8ea0c95",'email': "jd@mail.com",'name': "John",'surname': "Doe" }];

        component = fixture.componentInstance;
        
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('#requests'));
        el = de.nativeElement;

      });
    }));

    
    it('should be created', async() => {
      expect(component).toBeTruthy();
    });

    it('should call the authenticateUser method when accept button is pressed', async(() => {
      spyOn(component,'authenticateUser');
      component = fixture.componentInstance;
      component.requests = requests;
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css("#accept")).nativeElement;
      el.click();
      expect(component.authenticateUser).toHaveBeenCalledTimes(1);
    }));

    it('should call the rejectUser method when reject button is pressed', async(() => {
      spyOn(component,'rejectUser');
      component = fixture.componentInstance;
      component.requests = requests
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css("#reject")).nativeElement;
      el.click();
      expect(component.rejectUser).toHaveBeenCalledTimes(1);
    }));

});
});
describe('Integration tests:', () => {
    describe('OrganisationComponent', () => {
  
      let component: OrganisationComponent;
      let fixture: ComponentFixture<OrganisationComponent>;
      let de: DebugElement;
      let el: HTMLElement;
      let aService;
      let hService;
      let router: Router;
  
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ OrganisationComponent ],
          imports:
          [
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            HttpClientTestingModule,
            RouterTestingModule,
            SharedModule,
            MatMenuModule,
            MatIconModule,
            MatCardModule
          ],
         providers: [
          {provide: HeaderService, useValue: {
            kickOut: () => {}}},
          {provide: AccountManagementService, useValue: {
            authenticate: () => {},
            getAllUsers: () => {},
            getUnauthenticatedUsers: () => {}
          }}
         ]
        })
        .compileComponents().then(()=>
        {
          fixture = TestBed.createComponent(OrganisationComponent);
  
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
          de = fixture.debugElement.query(By.css('form'));
          el = de.nativeElement;
          aService = TestBed.get(AccountManagementService);
          hService = TestBed.get(HeaderService);
          router = TestBed.get(Router);
          fixture.detectChanges();
  
        });
      }));
  
    describe('authenticateUser()', () => {

      it('should call correct functions when service call successful', async(() => {
        expect(aService).toBeDefined()
        spyOn(aService, 'authenticate').and.returnValue(of({message: "User authenticated"}));
        spyOn(aService, 'getAllUsers').and.callThrough();
        spyOn(aService, 'getUnauthenticatedUsers').and.callThrough();

        spyOn(component,'getAllUnauthenticatedUsers');
        spyOn(component,'getMembers');
        component.authenticateUser("jskvjsncvns031458s41s");
        fixture.detectChanges();

        expect(component.getAllUnauthenticatedUsers).toHaveBeenCalled();
        expect(component.getMembers).toHaveBeenCalled();
        

      }));

      it('should follow not call functions when error is received', async(() => {
        spyOn(aService, 'authenticate').and.returnValue(throwError({
          status: 403,
          error: {
            message: 'Access denied'
          }
        }));
        spyOn(component,'getAllUnauthenticatedUsers');
        spyOn(component,'getMembers');
        component.authenticateUser("jskvjsncvns031458s41s");
        fixture.detectChanges();

        expect(component.getAllUnauthenticatedUsers).not.toHaveBeenCalled();
        expect(component.getMembers).not.toHaveBeenCalled();

      }));
    });

    

    /*describe('registerDevice()', () => {

      it('should call getDevices() when device is added successfully', async(() => {
        component.addDeviceForm.controls['deviceName'].setValue('Camera');
        component.addDeviceForm.controls['macAddress'].setValue('55-88-99-aa-dd-ff');
        fixture.detectChanges();
        spyOn(component, 'getDevices');
        spyOn(iotService, 'registerDevice').and.returnValue(of({message: "Device successfully registered"}));
        component.registerDevice(component.addDeviceForm.value);
        
        fixture.detectChanges();
        expect(component.getDevices).toHaveBeenCalled();

      }));

      it('should catch error when device is not added successfully', async(() => {
        component.addDeviceForm.controls['deviceName'].setValue('Camera');
        component.addDeviceForm.controls['macAddress'].setValue('55-88-99-aa-dd-ff');
        fixture.detectChanges();
        spyOn(component, 'getDevices');
        spyOn(iotService, 'registerDevice').and.returnValue(throwError({
          status: 403,
          error: {
            message: 'Access denied'
          }
        }));
        component.registerDevice(component.addDeviceForm.value);
        
        fixture.detectChanges();
        expect(component.getDevices).not.toHaveBeenCalled();
      }));

  });

  describe('deregisterDevice()', () => {

    it('should call getDevices() when device is deregistered successfully', async(() => {
      fixture.detectChanges();
      spyOn(component, 'getDevices');
      spyOn(iotService, 'deregisterDevice').and.returnValue(of({message: "Device successfully deregistered"}));
      component.deregisterDevice("aidjfsd5df020ad0f5d");
      
      fixture.detectChanges();
      expect(component.getDevices).toHaveBeenCalled();

    }));

    it('should catch error when device is not deregistered successfully', async(() => {

      fixture.detectChanges();
      spyOn(component, 'getDevices');
      spyOn(iotService, 'deregisterDevice').and.returnValue(throwError({
        status: 403,
        error: {
          message: 'Access denied'
        }
      }));
      component.deregisterDevice("aidjfsd5df020ad0f5d");
      
      fixture.detectChanges();
      expect(component.getDevices).not.toHaveBeenCalled();
    }));

});
  
});
});
/*describe('Unit tests', () => {
describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let requests

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule,
          MatMenuModule,
          MatIconModule,
          MatCardModule
        ],
        providers: [
          MatMenuModule,
          MatIconModule,
          MatCardModule
        ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(OrganisationComponent);
      requests = [{ 'ID': "5f18ab456876e757b8ea0c95",'email': "jd@mail.com",'name': "John",'surname': "Doe" }];

      component = fixture.componentInstance;
      component.requests = requests
      fixture.detectChanges();

      de = fixture.debugElement.query(By.css('#requests'));
      el = de.nativeElement;

    });
  }));

  it('should be created',async() => {
    expect(component).toBeTruthy();
    component = fixture.componentInstance;
    component.requests = requests
    fixture.detectChanges();
  });

  it('should call the authenticateUser method when accept button is pressed', async(() => {
    spyOn(component,'authenticateUser');
    component = fixture.componentInstance;
    component.requests = requests
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css("#accept")).nativeElement;
    el.click();
    expect(component.authenticateUser).toHaveBeenCalledTimes(1);
  }));

  it('should call the rejectUser method when reject button is pressed', async(() => {
    spyOn(component,'rejectUser');
    component = fixture.componentInstance;
    component.requests = requests
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css("#reject")).nativeElement;
    el.click();
    expect(component.rejectUser).toHaveBeenCalledTimes(1);
  }));*/
});
});

