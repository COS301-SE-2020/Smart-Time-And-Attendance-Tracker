import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectManagementService } from './project-management.service';

describe('Unit tests:', () => {
describe('ProjectManagementService', () => {
  let service: ProjectManagementService;
  let HttpMock: HttpTestingController;
  let ROOT_URL = "http://localhost:3000/api/";
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectManagementService]
    });
    service = TestBed.inject(ProjectManagementService);
    HttpMock =TestBed.inject(HttpTestingController);

  });
  afterEach(async() =>{
    HttpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTask()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "projectID": "5f17f73aa3fe98481c473954",
        "taskName": "Video",
        "startDate": "2020/07/22",
        "dueDate": "2020/07/22"
    };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully added to project '};
      service.addTask(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/addTask');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "projectID": "5f17f73aa3fe98481c473954",
        "taskName": "Video",
        "startDate": "2020/07/22",
        "dueDate": "2020/07/22"
    };
      const token ="";
      const res = { message: 'No token provided'};
      service.addTask(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/addTask');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  /////////////////////////////
  describe('addProject()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "projectName": "Chill",
        "startDate": "2020/07/25",
        "dueDate": "2020/07/27",
        "hourlyRate": 0
    };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully added to project '};
      service.addProject(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/add');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "projectName": "Chill",
        "startDate": "2020/07/25",
        "dueDate": "2020/07/27",
        "hourlyRate": 0
    };
      const token ="";
      const res = { message: 'No token provided'};
      service.addProject(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/add');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  ////////////////////
  describe('addTask()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "projectName": "Chill",
        "startDate": "2020/07/25",
        "dueDate": "2020/07/27",
        "hourlyRate": 0
    };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully added to project '};
      service.addProject(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/add');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "projectName": "Chill",
        "startDate": "2020/07/25",
        "dueDate": "2020/07/27",
        "hourlyRate": 0
    };
      const token ="";
      const res = { message: 'No token provided'};
      service.addProject(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/add');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  /////////////////////
  describe('deleteTask()', () => {
    it('should return a response object from the API via DELETE', async() => {
      const task ="5f183b69309a5459bc810471";
      const project = "f183b69309a5459bc8104e6n"
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully deleted'};
      service.deleteTask(token,task,project).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'task?taskID='+ task+'&projectID='+project);
      expect(req2.request.method).toEqual('DELETE');
      req2.flush(res);
    });
    it('should return an error object from the API via DELETE if request is incomplete', async() => {
      const task ="5f183b69309a5459bc810471";
      const project = "f183b69309a5459bc8104e6n"
      const token ="";
      const res = {  message: 'No token provided'};
      service.deleteTask(token,task,project).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'task?taskID='+ task+'&projectID='+project);
      expect(req2.request.method).toEqual('DELETE');
      req2.flush(res);
    });
  });
////////////////////////
  describe('deleteProject()', () => {
    it('should return a response object from the API via DELETE', async() => {
      const project = "f183b69309a5459bc8104e6n"
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Project successfully deleted'};
      service.deleteProject(token,project).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project?projectID='+project);
      expect(req2.request.method).toEqual('DELETE');
      req2.flush(res);
    });
    it('should return an error object from the API via DELETE if request is incomplete', async() => {
      const project = "f183b69309a5459bc8104e6n"
      const token ="";
      const res = {message: 'No token provided'};
      service.deleteProject(token,project).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project?projectID='+project);
      expect(req2.request.method).toEqual('DELETE');
      req2.flush(res);
    });
  });
   /////////////////////////////
   describe('addProject()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "projectName": "Chill",
        "startDate": "2020/07/25",
        "dueDate": "2020/07/27",
        "hourlyRate": 0
    };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully added to project '}
      service.addProject(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/add');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "projectName": "Chill",
        "startDate": "2020/07/25",
        "dueDate": "2020/07/27",
        "hourlyRate": 0
    };
      const token ="";
      const res = { message: 'No token provided'};
      service.addProject(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/add');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  ////////////////////
  describe('editTask()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "taskID": "5f17f716a3fe98481c473951",
        "timeSpent" : 100
    };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task successfully updated '};
      service.editTask(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'task/update');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "taskID": "5f17f716a3fe98481c473951",
        "timeSpent" : 100
    };
      const token ="";
      const res = { message: 'No token provided'};
      service.editTask(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'task/update');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });

  ////////////////////
  describe('editProject()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "projectID": "5f1302bd16a15a17140103f1",
        "hourlyRate" : 100,
        "dueDate" : "2020/07/23"
    };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Project successfully updated '};
      service.editProject(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/update');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "projectID": "5f1302bd16a15a17140103f1",
        "hourlyRate" : 100,
        "dueDate" : "2020/07/23"
    };
      const token ="";
      const res = { message: 'No token provided'};
      service.editProject(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/update');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });

   ////////////////////
   describe('completeProject()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "projectID": "5f1302bd16a15a17140103f1" };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Project marked as completed '};
      service.completeProject(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/complete');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "projectID": "5f1302bd16a15a17140103f1" };
      const token ="";
      const res = { message: 'No token provided'};
      service.completeProject(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'project/complete');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });

  ////////////////////
  describe('completeTask()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "taskID": "5f1302bd16a15a17140103f1" };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task status updated to "Completed"'};
      service.completeTask(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'task/complete');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "taskID": "5f1302bd16a15a17140103f1" };
      const token ="";
      const res = { message: 'No token provided'};
      service.completeTask(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'task/complete');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  //////////////////////////
  describe('startTask()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "taskID": "5f1302bd16a15a17140103f1" };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Task status updated to "In Progress"'};
      service.startTask(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'task/start');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "taskID": "5f1302bd16a15a17140103f1" };
      const token ="";
      const res = { message: 'No token provided'}
      service.startTask(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'task/start');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  /////////////////////////////////

  describe('addTeam()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        "teamID": "5f1302bd16a15a17140103f1" };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Team added to project'};
      service.addTeam(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/addTeam');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        "teamID": "5f1302bd16a15a17140103f1" };
      const token ="";
      const res = { message: 'No token provided'}
      service.addTeam(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'project/addTeam');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  /////////////////////////////////

  describe('addTeamMember()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        'userID': '5f17f6f4a3fe98481c47394f',
        'userRole': 'Designer' };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Member added to project'};
      service.addTeamMember(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/addMember');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        'userID': '5f17f6f4a3fe98481c47394f',
        'userRole': 'Designer' };
      const token ="";
      const res = { message: 'No token provided'}
      service.addTeamMember(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'project/addMember');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  ///////////////////////////////////

  describe('removeTeamMember()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        'userID': '5f17f6f4a3fe98481c47394f' };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Member removed from project'};
      service.removeTeamMember(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/removeMember');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        'userID': '5f17f6f4a3fe98481c47394f' };
      const token ="";
      const res = { message: 'No token provided'}
      service.removeTeamMember(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'project/removeMember');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  /////////////////////////////////////////

  describe('changeRole()', () => {
    it('should return a response object from the API via POST', async() => {
      const req ={
        'userID': '5f17f6f4a3fe98481c47394f',
        'userRole': 'Designer' };
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nF8NXx7CHXdVBCYn7VPJaDYMUKLtTKEaryWOJvHIO18";
      const res = { message: 'Member role successfully updated'};
      service.changeRole(token,req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/changeRole');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });

    it('should return an error object from the API via POST if request is incomplete', async() => {
      const req ={
        'userID': '5f17f6f4a3fe98481c47394f',
        'userRole': 'Designer' };
      const token ="";
      const res = { message: 'No token provided'}
      service.changeRole(token,req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        }
      );
      const req2 = HttpMock.expectOne(ROOT_URL+'project/changeRole');
      expect(req2.request.method).toEqual('POST');
      req2.flush(res);
    });
  });
  ////////////////////////

  describe('getProjects()', () => {
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
      service.getProjects(req).subscribe(
        response=> {
          expect(response).toBe(res);
        }
      );

      const req2 = HttpMock.expectOne(ROOT_URL+'project/getProjects');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
    it('should return an error object from the API via GET if request is incomplete', async() => {
      const req ="";
      const res ={ message: "No token provided" };

      service.getProjects(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'project/getProjects');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
});
});