import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { HeaderService } from '../../services/header.service';
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
