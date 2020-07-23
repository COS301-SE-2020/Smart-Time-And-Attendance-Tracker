import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AccountManagementService } from './account-management.service';
describe('Unit tests:', () => {
  describe('AccountManagementService', () => {
    let service: AccountManagementService;
    let HttpMock: HttpTestingController;
    let ROOT_URL = "http://localhost:3000/api/";
    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AccountManagementService]
      });
      service = TestBed.inject(AccountManagementService);
      HttpMock =TestBed.inject(HttpTestingController);
    });

    afterEach(async() =>{
      HttpMock.verify();
    })

    it('should be created', async() => {
      expect(service).toBeTruthy();
    });
      describe('signUp()', () => {
      it('should return a response object from the API via POST', async() => {
        const req =
          {name: "Suzie", surname: "Smith", email:"suzieSmith@mail.com", password: "1234", passwordConf: "1234"};
        const res ={token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18", message: "Sign up successful."};
        service.signUp(req).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );

        const req2 = HttpMock.expectOne(ROOT_URL+'user/register');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
      it('should return an error object from the API via POST if request is incomplete', async() => {
        const req =
          {name: "Suzie", surname: "Smith", email:"suzieSmith@mail.com", password: "1234", passwordConf: "1234"};
        const res ={ message: "User already exists" };

        service.signUp(req).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          });

        const req2 = HttpMock.expectOne(ROOT_URL+'user/register');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });
    //////////////////////////////////////////
    describe('signIn()', () => { 
    it('should return a response object from the API via POST', async() => {
      const req =
        { email:"suzieSmith@mail.com", password: "1234"};
      const res ={token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18", message: "Sign in successful."};
      service.signIn(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/login');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req =
        {email:"suzieSmith@mail.com", password: "123"};
      const res ={ message: "Incorrect password." };

      service.signIn(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/login');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  //////////////////////////////////
  describe('getRoles()', () => { 
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ roles: [
        "General Team Member"
      ] };
      service.getRoles(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getRoles');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getRoles(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getRoles');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
  /////////////////////////////////////
  describe('getName()', () => { 
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={name: "Suzie", surname: "Smith", email:"suzieSmith@mail.com"};
      service.getName(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getName');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getName(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getName');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
  ///////////////////////////////////
  describe('authenticate()', () => { 
    it('should return a response object from the API via POST', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const id = { UserID:"5f17df909b3e2d42dcbc3efb"};
      const res ={message: 'User authenticated'};
      service.authenticate(req, id).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/authenticateUser');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ="";
      const id = { UserID:"5f17df909b3e2d42dcbc3efb"};
      const res ={ message: "No token provided" };

      service.authenticate(req, id).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/authenticateUser');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    /*it('should return an error object from the API via POST when no userID is provided', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const id ="";
      const res ={ message: "User not found" };

      service.authenticate(req,id).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/authenticateUser');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });*/
  });
  //////////////////////////////////////////
  describe('reject()', () => { 
    it('should return a response object from the API via POST', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const id = { UserID:"5f17df909b3e2d42dcbc3efb"};
      const res ={message: 'User removed'};
      service.reject(req, id).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/removeUser');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ="";
      const id = { UserID:"5f17df909b3e2d42dcbc3efb"};
      const res ={ message: "No token provided" };

      service.reject(req, id).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/removeUser');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
   /* it('should return an error object from the API via POST when no userID is provided', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const id ="";
      const res ={ message: "User not found" };

      service.reject(req,id).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/removeUser');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });*/
  });
  /////////////////////////////
  describe('getUnauthenticatedUsers()', () => { 
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ID : "5f17df909b3e2d42dcbc3efb", email : "suzieSmith@mail.com", name : "Suzie", surname : "Smith"};
      service.getUnauthenticatedUsers(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getUnauthenticatedUsers');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getUnauthenticatedUsers(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getUnauthenticatedUsers');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
  //////////////////////////////
  describe('getAllUsers()', () => { 
    it('should return a response object from the API via GET', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={ID : "5f17df909b3e2d42dcbc3efb", email : "suzieSmith@mail.com", name : "Suzie", surname : "Smith"};
      service.getAllUsers(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getAllUsers');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getAllUsers(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getAllUsers');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
  //////////////////////////////
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
////////////////////////////////////
  describe('getTimeEntries()', () => { 
    it('should return a response object from the API via GET', async() => {
      const date = "2020/07/22";
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res ={"timeEntries": [
        {
          timeEntryID: "5f17f01f5817d129acd1ab1a", date:"2020/07/22", startTime:1593956841, endTime:1593956973, activeTime:132, project: "Demo",task: "Code", description: "Manual entry", monetaryValue: 100}
        ]};
      service.getTimeEntries(date,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getDailyTimeEntries?date='+date);
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const date = "2020/07/22";
      const res ={ message: "No token provided" };

      service.getTimeEntries(date, req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getDailyTimeEntries?date='+date);
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
   /* it('should return an error object from the API via GET when no date is provided', async() => {
      const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const date = "";
      const res ={ message: "No time entries for the given day were found" };

      service.getTimeEntries(date, req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'userTimeEntry/getDailyTimeEntries?date='+date);
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });*/
  });
});
