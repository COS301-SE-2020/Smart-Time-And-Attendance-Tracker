import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TeamsComponent } from './Teams.component';

describe('TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsComponent, RouterTestingModule ],
      imports:
      [RouterTestingModule],
      providers: [RouterTestingModule]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
