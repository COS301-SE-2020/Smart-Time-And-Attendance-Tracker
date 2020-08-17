import { Injectable, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AccountManagementService {

  private ROOT_URL = "http://localhost:3000/api/";

  public roles = localStorage.getItem('roles');

  constructor(public http: HttpClient) { }
  //check if authenticated
  public isAuthenticated(values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);

    return this.http.post(this.ROOT_URL+'user/isAuthenticated', {
      headers: headers
    });
  }
  // sign up
  public signUp(values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    return this.http.post(this.ROOT_URL+'user/register', JSON.stringify(values), {
      headers: headers
    });
  }
  // sign in
  public signIn(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
    return this.http.post(this.ROOT_URL+'user/login', JSON.stringify(values), {
      headers: headers
    });
  }
  //get roles
  public getRoles(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get(this.ROOT_URL+'user/getRoles', {
      headers: headers
    });
  }
  //get name
  public getName(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get(this.ROOT_URL+'user/getName', {
      headers: headers
    });
  }
  //Get user's projects and tasks
  public getProjectsAndTasks(token){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.get(this.ROOT_URL+ 'user/getProjects', {
      headers: headers
    });
  }
  //Get time entries for the day
  public getTimeEntries(date, token){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
          let parameters = new HttpParams();
          parameters = parameters.append('date', date);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getDailyTimeEntries',{
      params: parameters,
      headers: headers
    });
  }

  /*** organisation management ***/

  //Authenticate user (security admin)
  public authenticate(token,userID){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'user/authenticateUser',JSON.stringify(userID), {
      headers: headers
    });
  }
  //Reject user (security admin)
  public reject(token, userID){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+ 'user/removeUser', JSON.stringify(userID),{
      headers: headers
    });
  }
  //Get all unauthenticated users (security admin)
  public getUnauthenticatedUsers(token){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.get(this.ROOT_URL+ 'user/getUnauthenticatedUsers', {
      headers: headers
    });
  }
  //Get all  users (security admin)
  public getAllUsers(token){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.get(this.ROOT_URL+ 'user/getAllUsers', {
      headers: headers
    });

  }


  // edit profile
  // edit settings
  // sign out
  // delete account

} // end service
