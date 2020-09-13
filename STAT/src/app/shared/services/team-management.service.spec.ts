import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamManagementService } from './team-management.service';
import { async } from 'rxjs/internal/scheduler/async';

describe('Unit tests:', () => {

  describe( 'TeamManagementService', async() => {
    let service: TeamManagementService;
    let HttpMock: HttpTestingController;
    let ROOT_URL = "http://localhost:3000/api/";
    beforeEach(async() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [TeamManagementService]
      });
      service = TestBed.inject(TeamManagementService);
      HttpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(async() =>{
      HttpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
    describe('createTeam()', () => {
      it('should return a response object from the API via POST', async() => {
        const req ={
         'teamName': 'A-Team'
       };
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res = { message: 'Team successfully created '};
        service.createTeam(req,token).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
        const req2 = HttpMock.expectOne(ROOT_URL+'team/add');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
  
      it('should return an error object from the API via POST if request is incomplete', async() => {
        const req ={
          'teamName': 'A-Team'
       };
        const token ="";
        const res = { message: 'No token provided'};
        service.createTeam(req,token).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/add');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });
    ///////////////////////////////////////
    describe('getTeams()', () => { 
      it('should return a response object from the API via GET', async() => {
        const req = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res ={"projects": [
          {
              "ID": "5f17f6f4a3fe98481c47394f",
              "teamName": "A-Team",
              "teamMembers": []
              
          }]};
        service.getTeams(req).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/getTeams');
        expect(req2.request.method).toEqual('GET');
        req2.flush(res);
      });
      it('should return an error object from the API via GET if request is incomplete', async() => {
        const req ="";
        const res ={ message: "No token provided" };
  
        service.getTeams(req).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          });
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/getTeams');
        expect(req2.request.method).toEqual('GET');
        req2.flush(res);
      });
    });
    ///////////////////////////////////
    describe('addTeamMember()', () => {
      it('should return a response object from the API via POST', async() => {
        const req ={
         'userID': 'A-5f17f6f4a3fe98481c47394f',
         'userRole': 'Coder'
       };
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res = { message: 'Team successfully created '};
        service.addTeamMember(req,token).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
        const req2 = HttpMock.expectOne(ROOT_URL+'team/addTeamMember');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
  
      it('should return an error object from the API via POST if request is incomplete', async() => {
        const req ={
          'userID': 'A-5f17f6f4a3fe98481c47394f',
         'userRole': 'Coder'
       };
        const token ="";
        const res = { message: 'No token provided'};
        service.addTeamMember(req,token).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/addTeamMember');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });

    ///////////////////////////////////
    describe('removeTeamMember()', () => {
      it('should return a response object from the API via POST', async() => {
        const req ={
         'userID': 'A-5f17f6f4a3fe98481c47394f'
       };
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res = { message: 'Team successfully created '};
        service.removeTeamMember(req,token).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
        const req2 = HttpMock.expectOne(ROOT_URL+'team/removeTeamMember');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
  
      it('should return an error object from the API via POST if request is incomplete', async() => {
        const req ={
          'userID': 'A-5f17f6f4a3fe98481c47394f'
       };
        const token ="";
        const res = { message: 'No token provided'};
        service.removeTeamMember(req,token).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/removeTeamMember');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });
    ///////////////////////////////////////
    describe('changeRole()', () => {
      it('should return a response object from the API via POST', async() => {
        const req ={
         'userID': '5f17f6f4a3fe98481c47394f',
         'userRole': 'Designer'
       };
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res = { message: 'Team member role successfully updated '};
        service.changeRole(req,token).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
        const req2 = HttpMock.expectOne(ROOT_URL+'team/changeRole');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
  
      it('should return an error object from the API via POST if request is incomplete', async() => {
        const req ={
          'userID': '5f17f6f4a3fe98481c47394f',
         'userRole': 'Designer'
       };
        const token ="";
        const res = { message: 'No token provided'};
        service.changeRole(req,token).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/changeRole');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });
     ///////////////////////////////////////
     describe('editTeam()', () => {
      it('should return a response object from the API via POST', async() => {
        const req ={
         'teamName': 'New Name',
         'teamID': '5f17f6f4a3fe98481c47394f'
       };
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res = { message: 'Team successfully updated '};
        service.editTeam(req,token).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
        const req2 = HttpMock.expectOne(ROOT_URL+'team/editTeam');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
  
      it('should return an error object from the API via POST if request is incomplete', async() => {
        const req ={
          'teamName': 'New Name',
          'teamID': '5f17f6f4a3fe98481c47394f'
        };
        const token ="";
        const res = { message: 'No token provided'};
        service.editTeam(req,token).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team/editTeam');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });

    ///////////////////////////////////////
    describe('deleteTeam()', () => {
      it('should return a response object from the API via DELETE', async() => {
        const req ='5f17f6f4a3fe98481c47394f'
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
        const res = { message: 'Team successfully updated '};
        service.deleteTeam(token,req).subscribe(
          response=> {
            expect(response).toBe(res);
          }
        );
        const req2 = HttpMock.expectOne(ROOT_URL+'team?teamID='+req);
        expect(req2.request.method).toEqual('DELETE');
        req2.flush(res);
      });
  
      it('should return an error object from the API via DELETE if request is incomplete', async() => {
        const req ='5f17f6f4a3fe98481c47394f'
        const token ="";
        const res = { message: 'No token provided'};
        service.deleteTeam(token,req).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          }
        );
  
        const req2 = HttpMock.expectOne(ROOT_URL+'team?teamID='+req);
        expect(req2.request.method).toEqual('DELETE');
        req2.flush(res);
      });
    });
  });
  });

