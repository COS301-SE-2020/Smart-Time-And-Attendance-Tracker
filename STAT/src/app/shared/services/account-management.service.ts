import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AccountManagementService {

  private ROOT_URL = "http://localhost:3000/api/";

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
  //Authenticate user (security admin)
  public authenticate(values,userID){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.post(this.ROOT_URL+'user/authenticateUser',JSON.stringify(userID), {
      headers: headers
    });
  }
  //Reject user (security admin)
  public reject(values, userID){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.post(this.ROOT_URL+ 'user/rejectUser', JSON.stringify(userID),{
      headers: headers
    });
  }
  //Get all unauthenticated users (security admin)
  public getUnathenticatedUsers(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get(this.ROOT_URL+ 'user/getUnauthenticatedUsers', {
      headers: headers
    });
  }
  //Get all  users (security admin)
  public getAllUsers(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get(this.ROOT_URL+ 'user/geAllUsers', {
      headers: headers
    });
  }
  // edit profile

  // edit settings

  // sign out

  // delete account
}
