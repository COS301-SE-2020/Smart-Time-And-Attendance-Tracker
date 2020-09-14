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
import { of } from 'rxjs';

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

    it('should call the deregisterDevice method when the delete button is pressed', () => {
      spyOn(component,'deregisterDevice');
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
      el = fixture.debugElement.query(By.css("#delete_device2")).nativeElement;
      el.click();
      fixture.detectChanges();
      expect(component.deregisterDevice).toHaveBeenCalledTimes(1);
    });

    // **************************
    // INVALID SIGN UP FORM TESTS
    // **************************

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
        
        fixture.detectChanges();

        expect(component.devices).toEqual([{'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
        {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'}]);

      }));
    });

    /*describe('registerDevice()', () => {

      it('should store correct variables when called', async(() => {
    
        spyOn(iotService, 'getDevices').and.callThrough();
        
        fixture.detectChanges();

        expect(component.devices).toBe([{'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
        {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'}]);

      }));
    });

      it('should redirect if unauthorised', async(() => {
        component.signUpForm.controls['name'].setValue('Jane');
        component.signUpForm.controls['surname'].setValue('Doe');
        component.signUpForm.controls['email'].setValue('janeDoe@mail.com');
        component.signUpForm.controls['password'].setValue('12345678');
        component.signUpForm.controls['passwordConf'].setValue('12345678');
        spyOn(ACService, 'signUp').and.callThrough();
        spyOn(ACService, 'isAuthenticated').and.returnValue(of({authenticated: false}));
        spyOn(router, 'navigate').and.callThrough();
        component.signUp( component.signUpForm.value);
        fixture.detectChanges();
  
        expect(localStorage.getItem('token')).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18");
        expect(localStorage.getItem('loggedIn')).toBe('true');
        expect(localStorage.getItem('roles')).toBe("General Team Member, Team Leader, System Administrator, Security Administrator");
        expect(localStorage.getItem('name')).toBe("Suzie");
        expect(localStorage.getItem('surname')).toBe("Smith");
        expect(router.navigate).toHaveBeenCalledWith(['unauthorised']);
      }));

      it('should store correct variables when invalid', async(() => {
        component.signUpForm.controls['name'].setValue('Jane');
        component.signUpForm.controls['surname'].setValue('Doe');
        component.signUpForm.controls['email'].setValue('janeDoe@mail.com');
        component.signUpForm.controls['password'].setValue('12345678');
        component.signUpForm.controls['passwordConf'].setValue('12345678');
        spyOn(router, 'navigate').and.callThrough();
        spyOn(ACService, 'isAuthenticated').and.returnValue(of({authenticated: true}));
        spyOn(ACService, 'signUp').and.returnValue(throwError({error:{message: "User already registered."}}));
        component.signUp( component.signUpForm.value);
        fixture.detectChanges();

        expect(localStorage.getItem('loggedIn')).toBe('false');
  
        expect(router.navigate).not.toHaveBeenCalled();
        expect(component.signUpError).toBe('User already registered.');

      }));

  });
  describe('signIn()', () => {

    it('should store correct variables when valid', async(() => {
      component.signInForm.controls['email'].setValue('janeDoe@mail.com');
      component.signInForm.controls['password'].setValue('12345678');

      spyOn(ACService, 'signIn').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();
      spyOn(ACService, 'isAuthenticated').and.returnValue(of({authenticated: true}));
      component.signIn( component.signInForm.value);
      fixture.detectChanges();

      expect(localStorage.getItem('token')).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18");
      expect(localStorage.getItem('loggedIn')).toBe('true');
      expect(localStorage.getItem('roles')).toBe("General Team Member, Team Leader, System Administrator, Security Administrator");
      expect(router.navigate).toHaveBeenCalledWith(['main']);
    }));

    it('should redirect if unauthorised', async(() => {
      component.signInForm.controls['email'].setValue('janeDoe@mail.com');
      component.signInForm.controls['password'].setValue('12345678');
      spyOn(ACService, 'signIn').and.callThrough();
      spyOn(ACService, 'isAuthenticated').and.returnValue(of({authenticated: false}));
      spyOn(router, 'navigate').and.callThrough();
      component.signIn( component.signInForm.value);
      fixture.detectChanges();
  
      expect(localStorage.getItem('token')).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18");
      expect(localStorage.getItem('loggedIn')).toBe('true');
      expect(localStorage.getItem('roles')).toBe("General Team Member, Team Leader, System Administrator, Security Administrator");
      expect(localStorage.getItem('name')).toBe("Suzie");
      expect(localStorage.getItem('surname')).toBe("Smith");
      expect(router.navigate).toHaveBeenCalledWith(['unauthorised']);
    }));

    it('should store correct variables when invalid', async(() => {

      component.signInForm.controls['email'].setValue('janeDoe@mail.com');
      component.signInForm.controls['password'].setValue('123456789');

      spyOn(router, 'navigate').and.callThrough();
      spyOn(ACService, 'isAuthenticated').and.returnValue(of({authenticated: true}));
      spyOn(ACService, 'signIn').and.returnValue(throwError({error:{message: "Incorrect password."}}));
      component.signIn( component.signInForm.value);
      fixture.detectChanges();

      expect(localStorage.getItem('loggedIn')).toBe('false');

      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.signInError).toBe('Incorrect password.');

    }));
  });*/
});
});