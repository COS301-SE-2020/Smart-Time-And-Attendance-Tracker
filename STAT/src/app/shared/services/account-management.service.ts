import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AccountManagementService {
 
  constructor(public http: HttpClient) { }

  // sign up
  public signUp(values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    return this.http.post('http://localhost:3000/api/user/register', JSON.stringify(values), {
      headers: headers
    });
  }

  // sign in 
  public signIn(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    return this.http.post('http://localhost:3000/api/user/login', JSON.stringify(values), {
      headers: headers
    });
  }
  //get roles
  public getRoles(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/user/getRoles', JSON.stringify(values), {
      headers: headers
    });
  }
   
  // edit profile

  // edit settings

  // sign out

  // delete account
}
