import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrackingService } from './tracking.service';

describe('Unit tests:', () => {
describe('TrackingService', () => {
  let service: TrackingService;
  let HttpMock: HttpTestingController;
  let ROOT_URL = "http://localhost:3000/api/";
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrackingService]
    });
    service = TestBed.inject(TrackingService);
    HttpMock =TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('addMTimeEntry()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
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
      service.addMTimeEntry(req,token).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/addTimeEntry');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
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
      service.addMTimeEntry(req,token).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/addTimeEntry');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  ///////////////////////////////////////
  describe('getProjectsAndTasks()', () => { 
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={"projects": [
        {
            "ID": "5f17f6f4a3fe98481c47394f",
            "projectName": "Life",
            "dueDate": "2020/07/27",
            "hourlyRate": 1000,
            "tasks": [
                {
                    "ID": "5f17f72ba3fe98481c473953",
                    "taskName": "Cry",
                    "taskStatus": "Not Started",
                    "dueDate": "2020/07/22"
                },
                {
                    "ID": "5f17f721a3fe98481c473952",
                    "taskName": "Sleep",
                    "taskStatus": "Not Started",
                    "dueDate": "2020/07/26"
                }
            ]
        }]};
      service.getProjectsAndTasks(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getTasks');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getProjectsAndTasks(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getTasks');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
});
});
