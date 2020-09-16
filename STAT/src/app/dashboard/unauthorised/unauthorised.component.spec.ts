import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { UnauthorisedComponent } from './unauthorised.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { of } from 'rxjs';

describe('Unit Tests:', () => {
describe('UnauthorisedComponent', () => {
  let component: UnauthorisedComponent;
  let fixture: ComponentFixture<UnauthorisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorisedComponent ],
      imports:
          [ RouterTestingModule,HttpClientTestingModule]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(UnauthorisedComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
});

describe('Integration Tests:', () => {
  describe('UnauthorisedComponent', () => {
    let component: UnauthorisedComponent;
    let fixture: ComponentFixture<UnauthorisedComponent>;
    let service: AccountManagementService;
    let router: Router;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ UnauthorisedComponent ],
        imports:
            [ RouterTestingModule,HttpClientTestingModule],
        providers: [
          {provide: Router, useValue: {navigate: () => {}}},
          {provide: AccountManagementService, useValue: {
            isAuthenticated: () => {}
          }}
          ]
        })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(UnauthorisedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = TestBed.get(AccountManagementService);
        router = TestBed.get(Router);
      });
    }));
  
  
    describe('ngOnInit()', () => {

      it('should route to \'unauthorised\' when not authenticated', async(() => {
       
        spyOn(service, 'isAuthenticated').and.returnValue(of({authenticated: false}));
        spyOn(router, 'navigate').and.callThrough();
        component.ngOnInit();  
        expect(component.ngOnInit).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['unauthorised']);

      }));

      it('should route to \'main\' when authenticated', async(() => {
       
        spyOn(service, 'isAuthenticated').and.returnValue(of({authenticated: true}));
        spyOn(router, 'navigate').and.callThrough();
        component.ngOnInit();  
        expect(component.ngOnInit).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['unauthorised']);

      }));
    });
  });
  });

