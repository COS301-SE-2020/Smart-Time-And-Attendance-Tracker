import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserModule, By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DebugElement} from '@angular/core';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SignInComponent } from './sign-in.component';


describe('SignInComponent', () => {
  describe('Unit tests', () => {
    let component: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let ACService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInComponent ],
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
      fixture = TestBed.createComponent(SignInComponent);

      component = fixture.componentInstance;

      fixture.detectChanges();

      de = fixture.debugElement.query(By.css('form'));
      el = de.nativeElement;
      ACService = fixture.debugElement.injector.get(AccountManagementService);

    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
});