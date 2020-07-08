import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SignInComponent } from './sign-in.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

describe('Unit tests', () => {
  describe('SignInComponent', () => {
      let component: SignInComponent;
      let fixture: ComponentFixture<SignInComponent>;
      let de: DebugElement;
      let el: HTMLElement;


    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ SignInComponent ],
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
        fixture = TestBed.createComponent(SignInComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;

      });
    }));
    it('should be created', async(() => {
      expect(component).toBeTruthy();
    }));

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

    // **************************
    // INVALID SIGN UP FORM TESTS
    // **************************

    it('sign up form should be invalid with empty details', async(() => {
      component.signUpForm.controls['name'].setValue('');
      component.signUpForm.controls['surname'].setValue('');
      component.signUpForm.controls['email'].setValue('');
      component.signUpForm.controls['password'].setValue('');
      component.signUpForm.controls['passwordConf'].setValue('');
      expect(component.signUpForm.valid).toBeFalsy();
      expect(component.signUpForm.controls.email.hasError('required')).toBe(true);
      expect(component.signUpForm.controls.password.hasError('required')).toBe(true);
      expect(component.signUpForm.controls.passwordConf.hasError('required')).toBe(true);
    }));

    it('sign up form should be invalid with incorrect email format', async(() => {
      component.signUpForm.controls['name'].setValue('John');
      component.signUpForm.controls['surname'].setValue('Doe');
      component.signUpForm.controls['email'].setValue('jdoe');
      component.signUpForm.controls['password'].setValue('12345678');
      component.signUpForm.controls['passwordConf'].setValue('12345678');
      expect(component.signUpForm.valid).toBeFalsy();
      expect(component.signUpForm.controls.email.hasError('email')).toBe(true);
      expect(component.getEmailError()).toBe('Invalid email address');
    }));

    it('sign up form should be invalid with incorrect password length', async(() => {
      component.signUpForm.controls['name'].setValue('John');
      component.signUpForm.controls['surname'].setValue('Doe');
      component.signUpForm.controls['email'].setValue('jdoe@mail.com');
      component.signUpForm.controls['password'].setValue('1234567');
      component.signUpForm.controls['passwordConf'].setValue('12345678');
      expect(component.signUpForm.valid).toBeFalsy();
      expect(component.signUpForm.controls.password.hasError('minlength')).toBe(true);
      expect(component.getPassError()).toBe('Invalid password length');
    }));

    it('sign up form should be invalid when password confirmation does not match', async(() => {
      component.signUpForm.controls['name'].setValue('John');
      component.signUpForm.controls['surname'].setValue('Doe');
      component.signUpForm.controls['email'].setValue('jdoe@mail.com');
      component.signUpForm.controls['password'].setValue('12345678');
      component.signUpForm.controls['passwordConf'].setValue('123456789');
      expect(component.signUpForm.valid).toBeFalsy();
      expect(component.signUpForm.controls.passwordConf.hasError('mustMatch')).toBe(true);
      expect(component.getConfError()).toBe('Passwords do not match');
    }));

    // ****************************************** END

    it('sign up form should be valid', async(() => {
      component.signUpForm.controls['name'].setValue('Jane');
      component.signUpForm.controls['surname'].setValue('Doe');
      component.signUpForm.controls['email'].setValue('janeDoe@mail.com');
      component.signUpForm.controls['password'].setValue('12345678');
      component.signUpForm.controls['passwordConf'].setValue('12345678');
      expect(component.signUpForm.valid).toBeTruthy();
      expect(component.getEmailError()).toBe('');
      expect(component.getPassError()).toBe('');
      expect(component.getConfError()).toBe('');
    }));

    // **************************
    // INVALID SIGN IN FORM TESTS
    // **************************

    it('sign in form should be invalid with missing details', async(() => {
      component.signInForm.controls['email'].setValue('');
      component.signInForm.controls['password'].setValue('');
      expect(component.signInForm.valid).toBeFalsy();
    }));

    it('sign in form should be invalid with incorrect email format', async(() => {
      component.signInForm.controls['email'].setValue('jdoe@');
      component.signInForm.controls['password'].setValue('12345678');
      expect(component.signInForm.valid).toBeFalsy();
      expect(component.signInForm.controls.email.hasError('email')).toBe(true);
      expect(component.getEmailErrorSI()).toBe('Invalid email address');
      expect(component.signInForm.controls.password.hasError('minlength')).toBe(false);
      expect(component.getPassErrorSI()).toBe('');
    }));

    it('sign in form should be invalid with incorrect password length', async(() => {
      component.signInForm.controls['email'].setValue('jdoe@mail.com');
      component.signInForm.controls['password'].setValue('1234567');
      expect(component.signInForm.valid).toBeFalsy();
      expect(component.signInForm.controls.password.hasError('minlength')).toBe(true);
      expect(component.getPassErrorSI()).toBe('Invalid password length');
      expect(component.signInForm.controls.email.hasError('email')).toBe(false);
      expect(component.getEmailErrorSI()).toBe('');
    }));

    // ****************************************** END

    it('sign in form should be valid', async(() => {
      component.signInForm.controls['email'].setValue('john@mail.com');
      component.signInForm.controls['password'].setValue('12345678');
      expect(component.signInForm.valid).toBeTruthy();
      expect(component.getEmailErrorSI()).toBe('');
      expect(component.getPassErrorSI()).toBe('');
    }));

  });
});
describe('Integration tests:', () => {
  describe('SignInComponent', () => {

    let component: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let ACService;
    let router: Router;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ SignInComponent ],
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
        {provide: Router, useValue: {navigate: () => {}}},
        {provide: AccountManagementService, useValue: {
          getName: () => of({name: "Suzie", surname: "Smith"}),
          signUp: () => of({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18", message: "Sign up successful."}),
          signIn: () => of({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18", message: "Sign in successful."}),
          getRoles: () => of({roles: ["General Team Member"]})
        }}
       ]
      })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(SignInComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
        ACService = TestBed.get(AccountManagementService);
        router = TestBed.get(Router);

      });
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
      expect(localStorage.getItem('name')).toBe("Suzie");
      expect(localStorage.getItem('surname')).toBe("Smith");
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
      expect(component.signUpError).toBe('User already registered.');

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
    expect(localStorage.getItem('name')).toBe("Suzie");
    expect(localStorage.getItem('surname')).toBe("Smith");
    console.log(localStorage.getItem('surname'));
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
    expect(component.signInError).toBe('Incorrect password.');

  }));
});
});
});
