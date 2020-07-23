import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { OrganisationComponent } from './organisation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import {BrowserModule, By} from '@angular/platform-browser';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

describe('Unit tests:', () => {
describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule
        ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(OrganisationComponent);

      component = fixture.componentInstance;

      fixture.detectChanges();

      el = de.nativeElement;

    });
  }));

  it('should be created',async() => {
    expect(component).toBeTruthy();
  });

  it('should call the authenticateUser method when sign up button is pressed', async(() => {
    spyOn(component,'authenticateUser');
    el = fixture.debugElement.query(By.css("#accept")).nativeElement;
    el.click();
    expect(component.authenticateUser).toHaveBeenCalledTimes(1);
  }));

  it('should call the rejectUser method when sign in button is pressed', async(() => {
    spyOn(component,'rejectUser');
    el = fixture.debugElement.query(By.css("#reject")).nativeElement;
    el.click();
    expect(component.rejectUser).toHaveBeenCalledTimes(1);
  }));
});
});

