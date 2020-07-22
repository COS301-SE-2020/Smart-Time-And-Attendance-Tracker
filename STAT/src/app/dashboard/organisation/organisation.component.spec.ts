import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { OrganisationComponent } from './organisation.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
