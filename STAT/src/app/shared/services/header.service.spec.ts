import { TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import { RouterTestingModule } from '@angular/router/testing';
describe('Unit Tests:', () => {
describe('HeaderService', () => {
  let service: HeaderService;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [RouterTestingModule],
      providers: [ RouterTestingModule,
      {provide: Router, useValue: {navigate: () => {}}}]
    });
    
      service = TestBed.inject(HeaderService);
      router = TestBed.get(Router);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  describe('kickOut()', () => {
  
  it('should remove the appropriate localSorage variables', async(() => {
    spyOn(router, 'navigate').and.callThrough();
    service.kickOut();
    expect(localStorage.getItem('loggedIn')).toBe(null);
    expect(localStorage.getItem('roles')).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  }));
});
});
});
