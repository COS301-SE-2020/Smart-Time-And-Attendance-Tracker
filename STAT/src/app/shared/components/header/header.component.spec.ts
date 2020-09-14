import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';

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
          {provide: HeaderService, useValue: {kickOut: () => {}}}
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
       
        spyOn(service, 'kickOut').and.callThrough();
        component.logout();  
        expect(component.logout).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('loggedIn')).toBe(null);
        expect(localStorage.getItem('roles')).toBe(null);
        expect(localStorage.getItem('token')).toBe(null);
      }));
    });
  });
  });
  
