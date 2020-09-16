import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { IOTComponent } from './iot.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IotManagementService } from 'src/app/shared/services/iot-management.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/shared/services/header.service';
import { Observable, of, throwError } from 'rxjs';

describe('Unit tests:', () => {
  describe('IOTComponent', () => {

    let component: IOTComponent;
    let fixture: ComponentFixture<IOTComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ IOTComponent ],
        imports:
        [
          BrowserModule,
          FormsModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule,
          SharedModule
        ]
      })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(IOTComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;

      });
    }));

    
    it('should be created', async() => {
      expect(component).toBeTruthy();
    });

    it('add_device button should not be pressed if form is invalid ', async(() => {
      spyOn(component,'registerDevice');
      el = fixture.debugElement.query(By.css("#add_device")).nativeElement;
      el.click();
        expect(component.registerDevice).toHaveBeenCalledTimes(0);

    }));

    it('should open modal when the delete button is pressed', () => {
      spyOn(component,'deregisterDevice');
      spyOn(component,'open');
      component.devices = [
      {'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
      {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'},
      {'deviceName': 'Camera - Parking Entrance', 'macAddress': '888.759.28', 'description': 'Basement level B'},
      {'deviceName': 'Fingerprint Scanner', 'macAddress': '985.346.89', 'description': 'VIP Offices'},
      {'deviceName': 'Iris Scanner', 'macAddress': '995.274.78', 'description': 'Vault'},
    ];
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css("#delete_device")).nativeElement;
      el.click();
      fixture.detectChanges();
      expect(component.open).toHaveBeenCalledTimes(1);
    });

    it('add device form should be invalid with empty details', async(() => {
      component.addDeviceForm.controls['deviceName'].setValue('');
      component.addDeviceForm.controls['macAddress'].setValue('');

      expect(component.addDeviceForm.valid).toBeFalsy();
      expect(component.addDeviceForm.controls.deviceName.hasError('required')).toBe(true);
      expect(component.addDeviceForm.controls.macAddress.hasError('required')).toBe(true);
    }));


    it('add device form should be valid', async(() => {
      component.addDeviceForm.controls['deviceName'].setValue('Camera');
      component.addDeviceForm.controls['macAddress'].setValue('55-88-99-aa-dd-ff');
      expect(component.addDeviceForm.valid).toBeTruthy();
      expect(component.addDeviceForm.controls.deviceName.hasError('required')).toBe(false);
      expect(component.addDeviceForm.controls.macAddress.hasError('required')).toBe(false);
    }));

    it('should not call registerDevice() when add_device button is pressed and form is invalid ', async(() => {
      spyOn(component,'registerDevice');
      el = fixture.debugElement.query(By.css("#add_device")).nativeElement;
      el.click();
        expect(component.registerDevice).toHaveBeenCalledTimes(0);

  }));

  it('should call registerDevice() when add_device button is pressed and form is valid', async(() => {
    spyOn(component,'registerDevice');
    component.addDeviceForm.controls['deviceName'].setValue('Camera');
    component.addDeviceForm.controls['macAddress'].setValue('55-88-99-aa-dd-ff');
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css("#add_device")).nativeElement;
    el.click();
      expect(component.registerDevice).toHaveBeenCalledTimes(1);

}));

});
});
describe('Integration tests:', () => {
    describe('IOTComponent', () => {
  
      let component: IOTComponent;
      let fixture: ComponentFixture<IOTComponent>;
      let de: DebugElement;
      let el: HTMLElement;
      let iotService;
      let hService;
      let router: Router;
  
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ IOTComponent ],
          imports:
          [
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            HttpClientTestingModule,
            RouterTestingModule,
            SharedModule
          ],
         providers: [
          {provide: IotManagementService, useValue: {
            getDevices: () => of( {iotDevices:[{'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
            {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'}]}),
            isAuthenticated: () => {},
            registerDevice: () => {},
            deregisterDevice: () => {}
          }},
          {provide: HeaderService, useValue: {
            kickOut: () => {}}}
         ]
        })
        .compileComponents().then(()=>
        {
          fixture = TestBed.createComponent(IOTComponent);
  
          component = fixture.componentInstance;
  
          fixture.detectChanges();
  
          de = fixture.debugElement.query(By.css('form'));
          el = de.nativeElement;
          iotService = TestBed.get(IotManagementService);
          hService = TestBed.get(HeaderService);
          router = TestBed.get(Router);
  
        });
      }));
  
    describe('getDevices()', () => {

      it('should store correct variables when called', async(() => {
    
        spyOn(iotService, 'getDevices').and.callThrough();
        component.getDevices();
        fixture.detectChanges();

        expect(component.devices).toEqual([{'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
        {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'}]);

      }));

      it('should not store variables when error is received', async(() => {
        component.devices = [];
        spyOn(hService, 'kickOut').and.callThrough();
        spyOn(iotService, 'getDevices').and.returnValue(throwError({
          status: 403,
          error: {
            message: 'Access denied'
          }
        }));
        component.getDevices();
        fixture.detectChanges();

        expect(component.devices).not.toEqual([{'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
        {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'}]);

      }));
    });

    

    describe('registerDevice()', () => {

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