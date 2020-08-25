import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IOTComponent } from './iot.component';

describe('IOTComponent', () => {
  let component: IOTComponent;
  let fixture: ComponentFixture<IOTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IOTComponent ]
    })
    .compileComponents();
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
