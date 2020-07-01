import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SignUpComponent } from './sign-up.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('Unit tests:', () => {
  describe('SignUpComponent', () => {

    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let ACService;
    let router: Router;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ SignUpComponent ],
        imports:
        [
          BrowserModule,
          FormsModule,
          ReactiveFormsModule,
          HttpClientTestingModule,
          RouterTestingModule
        ],
       providers: [
        {provide: Router, useValue: {navigate: () => {}}},
        {provide: AccountManagementService, useValue: {
          signUp: () => of({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18", message: "Sign up successful."}),
          signIn: () => of({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18", message: "Sign in successful."}),
          getRoles: () => of({status:true, roles: ["General Team Member"]}),
          params: of({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18"})}}
       ]
      })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(SignUpComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
        ACService = TestBed.get(AccountManagementService);
        router = TestBed.get(Router);

      });
    }));

    
    it('should be created', async() => {
      expect(component).toBeTruthy();
    });

    it('should call the signUp method when sign up button is pressed', async(() => {
      spyOn(component,'signUp');
      el = fixture.debugElement.query(By.css("#sign_up")).nativeElement;
      el.click();
      expect(component.signUp).toHaveBeenCalledTimes(1);
    }));

    it('should call the signIn method when sign in button is pressed', async(() => {
      spyOn(component,'signIn');
      el = fixture.debugElement.query(By.css("#sign_in")).nativeElement;
      el.click();
      expect(component.signIn).toHaveBeenCalledTimes(1);
    }));

    it('sign up form should be invalid', async(() => {
      component.signUpForm.controls['name'].setValue('');
      component.signUpForm.controls['surname'].setValue('');
      component.signUpForm.controls['email'].setValue('');
      component.signUpForm.controls['password'].setValue('');
      component.signUpForm.controls['passwordConf'].setValue('');
      expect(component.signUpForm.valid).toBeFalsy();
    }));

    it('sign up form should be valid', async(() => {
      component.signUpForm.controls['name'].setValue('Jane');
      component.signUpForm.controls['surname'].setValue('Doe');
      component.signUpForm.controls['email'].setValue('janeDoe@mail.com');
      component.signUpForm.controls['password'].setValue('12345678');
      component.signUpForm.controls['passwordConf'].setValue('12345678');
      expect(component.signUpForm.valid).toBeTruthy();
    }));

    it('sign in form should be invalid', async(() => {
      component.signInForm.controls['email'].setValue('');
      component.signInForm.controls['password'].setValue('');
      expect(component.signInForm.valid).toBeFalsy();
    }));

    it('sign in form should be valid', async(() => {
      component.signInForm.controls['email'].setValue('');
      component.signInForm.controls['password'].setValue('');
      expect(component.signInForm.valid).toBeFalsy();
    }));
    describe('signUp()', () => {

      it('should store correct variables when valid', async(() => {
        component.signUpForm.controls['name'].setValue('Jane');
        component.signUpForm.controls['surname'].setValue('Doe');
        component.signUpForm.controls['email'].setValue('janeDoe@mail.com');
        component.signUpForm.controls['password'].setValue('12345678');
        component.signUpForm.controls['passwordConf'].setValue('12345678');
        spyOn(ACService, 'signUp').and.callThrough();
        spyOn(router, 'navigate').and.callThrough();
        component.signUp( component.signUpForm.value);
        fixture.detectChanges();

        expect(localStorage.getItem('token')).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18");
        expect(localStorage.getItem('loggedIn')).toBe('true');
        expect(localStorage.getItem('roles')).toBe("General Team Member");
        expect(router.navigate).toHaveBeenCalledWith(['main']);
      }));

      it('should store correct variables when invalid', async(() => {
        component.signUpForm.controls['name'].setValue('Jane');
        component.signUpForm.controls['surname'].setValue('Doe');
        component.signUpForm.controls['email'].setValue('janeDoe@mail.com');
        component.signUpForm.controls['password'].setValue('12345678');
        component.signUpForm.controls['passwordConf'].setValue('12345678');
        spyOn(router, 'navigate').and.callThrough();

        spyOn(ACService, 'signUp').and.returnValue(throwError({error:{message: "User already registered."}}));
        component.signUp( component.signUpForm.value);
        fixture.detectChanges();

        expect(localStorage.getItem('loggedIn')).toBe('false');
  
        expect(router.navigate).not.toHaveBeenCalled();
      }));

  });
  describe('signIn()', () => {

    it('should store correct variables when valid', async(() => {
      component.signInForm.controls['email'].setValue('janeDoe@mail.com');
      component.signInForm.controls['password'].setValue('12345678');

      spyOn(ACService, 'signIn').and.callThrough();
      spyOn(router, 'navigate').and.callThrough();
      component.signIn( component.signInForm.value);
      fixture.detectChanges();

      expect(localStorage.getItem('token')).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18");
      expect(localStorage.getItem('loggedIn')).toBe('true');
      expect(localStorage.getItem('roles')).toBe("General Team Member");
      expect(router.navigate).toHaveBeenCalledWith(['main']);
    }));

    it('should store correct variables when invalid', async(() => {

      component.signInForm.controls['email'].setValue('janeDoe@mail.com');
      component.signInForm.controls['password'].setValue('123456789');

      spyOn(router, 'navigate').and.callThrough();

      spyOn(ACService, 'signIn').and.returnValue(throwError({error:{message: "Incorrect password."}}));
      component.signIn( component.signInForm.value);
      fixture.detectChanges();

      expect(localStorage.getItem('loggedIn')).toBe('false');

      expect(router.navigate).not.toHaveBeenCalled();
    }));

});
  });
});
