import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountManagementService } from './account-management.service';

describe('AccountManagementService', () => {
  let service: AccountManagementService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountManagementService]

    });
    service = TestBed.inject(AccountManagementService);
  });

  it('should be created', async() => {
    expect(service).toBeTruthy();
  });
});
