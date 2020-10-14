import { TestBed } from '@angular/core/testing';

import { IotManagementService } from './iot-management.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Unit Tests', () => {
describe('IotManagementService:', () => {
  let service: IotManagementService;
    let HttpMock: HttpTestingController;
    let ROOT_URL = "https://stat-server.azurewebsites.net/api/";
    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [IotManagementService]
      });
      service = TestBed.inject(IotManagementService);
      HttpMock =TestBed.inject(HttpTestingController);
    });

    afterEach(async() =>{
      HttpMock.verify();
    });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={deviceName: "Camera", macAddress: "aa-bb-cc-45-96-52",description:"Building 2"};
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ message: "Device successfully registered" };
      service.registerDevice(token, req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'iotDevice/register');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const token ="";
      const req ={deviceName: "Camera", macAddress: "aa-bb-cc-45-96-52",description:"Building 2"};
      const res ={ message: "No token provided" };

      service.registerDevice(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'iotDevice/register');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });

  ////////////////////////////////////

  describe('deregisterDevice()', () => {
    it('should return a response object from the API via POST', async() => {
      const req  = {'deviceID': "5f1061ff3ded01867476c682"};
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={  totalDailyValues: [] };
      service.deregisterDevice(token, req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'iotDevice/deregister');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const token ="";
      const req = {'deviceID': "5f1061ff3ded01867476c682"};
      const res ={ message: "No token provided" };

      service.deregisterDevice(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'iotDevice/deregister');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });

  /////////////////////////

  describe('getDevices()', () => {
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={devices:[]};
      service.getDevices(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'iotDevice/getAllDevices');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getDevices(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'iotDevice/getAllDevices');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
});
});;
