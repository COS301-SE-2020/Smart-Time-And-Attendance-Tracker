import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',  
})

export class AccountManagementService {
 

  //public static token :string;
  //public static roles: Array<{id: number, text: string}>;
  constructor(public http: HttpClient) { }

  // sign up
  public signUp(values) {
    const headers = new HttpHeaders()
         // .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    this.http.post('http://localhost:3000/api/user/register', JSON.stringify(values), {
      headers: headers
    })
    .subscribe(data => {
      localStorage.setItem('token', data['token']);
      localStorage.setItem('roles', data['roles']);
      return "Success";
    },
    error => {return error.error.message;}
  );}

  // sign in 
  public signIn(values): Observable<string>{
    var ret;
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.http.post('http://localhost:3000/api/user/login', JSON.stringify(values), {
      headers: headers
    })
    .subscribe(data => {
    //AccountManagementService.token = data["token"];
   // AccountManagementService.roles = data["roles"];
    localStorage.setItem('token', data['token']);
    localStorage.setItem('roles', data['roles']);
    ret = "Success";
    },
    error => {ret =  error.error.message;}
  );
    return ret.asObservable(); }
  // edit profile

  // edit settings

  // sign out

  // delete account
}
