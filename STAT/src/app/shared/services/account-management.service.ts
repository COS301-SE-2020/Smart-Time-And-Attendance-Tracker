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
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get('http://localhost:3000/api/user/getRoles', {
      headers: headers
    });
  }
  //get name
  public getName(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get('http://localhost:3000/api/user/getName', {
      headers: headers
    });
  }
  //Authenticate user (security admin)
  public authenticate(values,userID){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.post('http://localhost:3000/api/user/authenticateUser',JSON.stringify(userID), {
      headers: headers
    });
  }
  //Reject user (security admin)
  public reject(values, userID){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.post('http://localhost:3000/api/user/rejectUser', JSON.stringify(userID),{
      headers: headers
    });
  }
  //Get all unauthenticated users (security admin)
  public getUnathenticatedUsers(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get('http://localhost:3000/api/user/getUnauthenticatedUsers', {
      headers: headers
    });
  }
  // edit profile

  // edit settings

  // sign out

  // delete account
}
