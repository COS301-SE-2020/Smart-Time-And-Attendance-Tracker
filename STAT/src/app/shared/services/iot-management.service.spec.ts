import { TestBed } from '@angular/core/testing';

import { IotManagementService } from './iot-management.service';

describe('IotManagementService', () => {
  let service: IotManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IotManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
