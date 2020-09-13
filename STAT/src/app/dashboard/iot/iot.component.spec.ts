import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { IOTComponent } from './iot.component';
import { RouterTestingModule } from '@angular/router/testing';
describe('IOTComponent', () => {
  let component: IOTComponent;
  let fixture: ComponentFixture<IOTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOTComponent ],
      imports:
      [RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(IOTComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
