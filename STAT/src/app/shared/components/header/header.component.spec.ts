import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('Unit Tests:', () => {
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  
  beforeEach((async () => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports:
      [RouterTestingModule],
      providers: [RouterTestingModule ,HeaderService]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should be created', async () => {
    expect(component).toBeTruthy();
  });

  it('should be follow correct path OnInit if logged in', async () => {
    localStorage.setItem("loggedIn",'true');
    expect(component).toBeTruthy();
  });
});
});

describe('Integration Tests:', () => {
  describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    var service: HeaderService;
    let router: Router;
  
    beforeEach((async () => {
      TestBed.configureTestingModule({
        declarations: [ HeaderComponent ],
        imports:
        [RouterTestingModule],
        providers: [ HeaderService, RouterTestingModule]
          /*{provide: Router, useValue: {navigate: () => {}}},
          {provide: HeaderService, useValue: {kickOut: () => of({})}}
         ]*/
        })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.get(RouterTestingModule);
        service = TestBed.get(HeaderService);
      });
    }));
  
    describe('logout()', () => {

      it('should remove the appropriate variables', async(() => {
       
        spyOn(service, 'kickOut');
        spyOn(component, 'logout');
        component.logout();  
        fixture.detectChanges();
        expect(component.logout).toHaveBeenCalledTimes(1);
        expect(service.kickOut).toHaveBeenCalledTimes(1);
      }));
    });
  });
  });
  
