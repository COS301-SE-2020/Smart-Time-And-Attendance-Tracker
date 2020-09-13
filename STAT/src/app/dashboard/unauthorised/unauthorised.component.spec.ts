import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { UnauthorisedComponent } from './unauthorised.component';
import { RouterTestingModule } from '@angular/router/testing';
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
