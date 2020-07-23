import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { OrganisationComponent } from './organisation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import {BrowserModule, By} from '@angular/platform-browser';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

describe('Unit tests', () => {
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
  }));
});
});

