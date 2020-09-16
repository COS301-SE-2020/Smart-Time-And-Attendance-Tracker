import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HistoryService } from './history.service';

describe('Unit Tests', () => {
describe('HistoryService:', () => {
  let service: HistoryService;
    let HttpMock: HttpTestingController;
    let ROOT_URL = "http://localhost:3000/api/";
    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [HistoryService]
      });
      service = TestBed.inject(HistoryService);
      HttpMock =TestBed.inject(HttpTestingController);
    });

    afterEach(async() =>{
      HttpMock.verify();
    })
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOwnEntries()', () => {
    it('should return a response object from the API via GET', async() => {
      var values= {minDate: '2020/08/10', maxDate: '2020/08/16'}
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={  timeEntries: [] };
      service.getOwnEntries(req,values).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getOwnTimeEntries?minDate=2020/08/10&maxDate=2020/08/16');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      var values= {minDate: '2020/08/10', maxDate: '2020/08/16'}
      const res ={ message: "No token provided" };

      service.getOwnEntries(req,values).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getOwnTimeEntries?minDate=2020/08/10&maxDate=2020/08/16');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

  ////////////////////////////////////

  describe('getUserEntries()', () => {
    it('should return a response object from the API via GET', async() => {
      var values= {minDate: '2020/08/10', maxDate: '2020/08/16',userID: '5f17f6f4a3fe98481c47394f'}
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ timeEntries: [] };
      service.getUserEntries(req,values).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserTimeEntries?userID=5f17f6f4a3fe98481c47394f&minDate=2020/08/10&maxDate=2020/08/16');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      var values= {minDate: '2020/08/10', maxDate: '2020/08/16',userID :'5f17f6f4a3fe98481c47394f'}
      const res ={ message: "No token provided" };

      service.getUserEntries(req,values).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserTimeEntries?userID=5f17f6f4a3fe98481c47394f&minDate=2020/08/10&maxDate=2020/08/16');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

  /////////////////////////

  describe('getAllUserEntries()', () => {
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ID : "5f17df909b3e2d42dcbc3efb", email : "suzieSmith@mail.com", name : "Suzie", surname : "Smith", timeEntries:[]};
      service.getAllUserEntries(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getAllUsersTimeEntries');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getAllUserEntries(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getAllUsersTimeEntries');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
/////////////////////////////////////////

  describe('import()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        'userID': "5f17df909b3e2d42dcbc3efb",
        "Date" : "2020/07/14",
        "TaskID" : "5f1061ff3ded01867476c682",
        "ProjectID": "5f12ed1495236d59d08bc98d",
        "TaskName": "Eat Again",
        "ProjectName": "Demo 2",
         "StartTime": 1593956841,
         "EndTime":1593956858,
         "ActiveTime" :44,
         "Description" : "Manual entry",
         "Device" : "Website"
     };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully added to project '};
      service.import(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/importTimeEntry');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        'userID': "5f17df909b3e2d42dcbc3efb",
        "Date" : "2020/07/14",
        "TaskID" : "5f1061ff3ded01867476c682",
        "ProjectID": "5f12ed1495236d59d08bc98d",
        "TaskName": "Eat Again",
        "ProjectName": "Demo 2",
         "StartTime": 1593956841,
         "EndTime":1593956858,
         "ActiveTime" :44,
         "Description" : "Manual entry",
         "Device" : "Website"
     };
      const token ="";
      const res = { message: 'No token provided'};
      service.import(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/importTimeEntry');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });

  ///////////////////////////////////
  describe('getAllProjectEntries()', () => {
    it('should return a response object from the API via GET', async() => {
      var values= {minDate: '2020/08/10', maxDate: '2020/08/16',projectID: '5f17f6f4a3fe98481c47394f'}
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ projectName : 'A-Team', teamMembers: [] };
      service.getAllProjectEntries(req,values).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getProjectTimeEntries?projectID=5f17f6f4a3fe98481c47394f&minDate=2020/08/10&maxDate=2020/08/16');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      var values= {minDate: '2020/08/10', maxDate: '2020/08/16',projectID :'5f17f6f4a3fe98481c47394f'}
      const res ={ message: "No token provided" };

      service.getAllProjectEntries(req,values).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getProjectTimeEntries?projectID=5f17f6f4a3fe98481c47394f&minDate=2020/08/10&maxDate=2020/08/16');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
});
});