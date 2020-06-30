import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {

  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let ACService;

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
      ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(SignUpComponent);

      component = fixture.componentInstance;

      fixture.detectChanges();

      de = fixture.debugElement.query(By.css('form'));
      el = de.nativeElement;
      ACService = fixture.debugElement.injector.get(AccountManagementService);

    });
  }));

  describe('Unit tests:', () => {
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
});
});
