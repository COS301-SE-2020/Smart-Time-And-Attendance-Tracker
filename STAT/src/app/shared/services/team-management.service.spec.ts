import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamManagementService } from './team-management.service';

describe('Unit tests:', () => {
  describe( TeamManagementService', () => {
    let service: TeamManagementService;
    let HttpMock: HttpTestingController;
    let ROOT_URL = "http://localhost:3000/api/";
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [TeamManagementService]
      });
      service = TestBed.inject(TeamManagementService);
      HttpMock = TestBed.inject(HttpTestingController);
    });
    afterEach(async() =>{
      HttpMock.verify();
    })
  })
})
