import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalysisService } from './analysis.service';

describe('Unit Tests', () => {
describe('AnalysisService:', () => {
  let service: AnalysisService;
    let HttpMock: HttpTestingController;
    let ROOT_URL = "https://stat-server.azurewebsites.net/api/";
    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AnalysisService]
      });
      service = TestBed.inject(AnalysisService);
      HttpMock =TestBed.inject(HttpTestingController);
    });

    afterEach(async() =>{
      HttpMock.verify();
    })
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDailyValues()', () => {
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={  totalDailyValues: [] };
      service.getDailyValues(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserDailyTotalTime');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getDailyValues(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserDailyTotalTime');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

  ////////////////////////////////////

  describe('getProjectDailyValues()', () => {
    it('should return a response object from the API via GET', async() => {
      var values='5f17f6f4a3fe98481c47394f';
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ totalDailyValuesEntries: [] };
      service.getProjectDailyValues(req,values).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getProjectDailyTotalTime?projectID=5f17f6f4a3fe98481c47394f');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      var values= '5f17f6f4a3fe98481c47394f';
      const res ={ message: "No token provided" };

      service.getProjectDailyValues(req,values).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getProjectDailyTotalTime?projectID=5f17f6f4a3fe98481c47394f');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

  /////////////////////////

  describe('getDailyMoney()', () => {
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={totalDailyValues:[]};
      service.getDailyMoney(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserDailyTotalMoney');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getDailyMoney(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserDailyTotalMoney');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
/////////////////////////////////////////

  describe('getWeeklyProjectsTimes()', () => {
    it('should return a response object from the API via POST', async() => {
      
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { totalProjectsTimes: []};
      service.getWeeklyProjectsTimes(token).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserWeeklyTimeForProjects');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
     
      const token ="";
      const res = { message: 'No token provided'};
      service.getWeeklyProjectsTimes(token).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserWeeklyTimeForProjects');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

  ///////////////////////////////////
  describe('getWeeklyTasksTimes()', () => {
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ totalTasksTimes: [] };
      service.getWeeklyTasksTimes(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserWeeklyTimeForTasks');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getWeeklyTasksTimes(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserWeeklyTimeForTasks');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

  ///////////////////////////////////
  describe('getDevices()', () => {
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ totalDevices: [] };
      service.getDevices(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserDevices');
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

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getUserDevices');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

   ////////////////////////////////////

   describe('getProjectMembersTotalTime()', () => {
    it('should return a response object from the API via GET', async() => {
      var values= '5f17f6f4a3fe98481c47394f';
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ membersTotalTime: [] };
      service.getProjectMembersTotalTime(req,values).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getProjectMembersTotalTime?projectID=5f17f6f4a3fe98481c47394f');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      var values=  '5f17f6f4a3fe98481c47394f';
      const res ={ message: "No token provided" };

      service.getProjectMembersTotalTime(req,values).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getProjectMembersTotalTime?projectID=5f17f6f4a3fe98481c47394f');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });

    ///////////////////////////////////
    describe('getPredictionsForWeek()', () => {
      it('should return a response object from the API via GET', async() => {
        const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res ={ projectID: "5f17f6f4a3fe98481c47394f", projectName: "Testing", pastTimes : [],predictions : []  };
        service.getPredictionsForWeek(req).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'analysis/projectWeeklyHoursPrediction');
        expect(req2.request.method).toEqual('GET');
        req2.flush(res);
      });
      it('should return an error object from the API via GET if request is incomplete', async() => {
        const req ="";
        const res ={ message: "No token provided" };
  
        service.getPredictionsForWeek(req).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          });
  
        const req2 = HttpMock.expectOne(ROOT_URL+'analysis/projectWeeklyHoursPrediction');
        expect(req2.request.method).toEqual('GET');
        req2.flush(res);
      });
    });
});
});