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
      it('should return an error object from the API via POST', async() => {
        const req =
          {name: "Suzie", surname: "Smith", email:"suzieSmith@mail.com", password: "1234", passwordConf: "1234"};
        const res ={ message: "User already exists." };

        service.signUp(req).subscribe(
          () => {}, err => {
            expect(err).toBe(res);
          });

        const req2 = HttpMock.expectOne(ROOT_URL+'user/register');
        expect(req2.request.method).toEqual('POST');
        req2.flush(res);
      });
    });
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
    it('should return an error object from the API via POST', async() => {
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
    it('should return an error object from the API via GET', async() => {
      const req ="";
      const res ={ message: "No token provided." };

      service.getRoles(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getRoles');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
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
    it('should return an error object from the API via GET', async() => {
      const req ="";
      const res ={ message: "No token provided." };

      service.getName(req).subscribe(
        () => {}, err => {
          expect(err).toBe(res);
        });

      const req2 = HttpMock.expectOne(ROOT_URL+'user/getName');
      expect(req2.request.method).toEqual('GET');
      req2.flush(res);
    });
  });
  });
});
