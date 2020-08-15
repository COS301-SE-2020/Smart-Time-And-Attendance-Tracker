import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private ROOT_URL = "http://localhost:3000/api/";

  public roles = localStorage.getItem('roles');

  constructor(public http: HttpClient) { }

  // get own time entries
  getOwnEntries(token) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getOwnTimeEntries', {
      headers: headers
    });
  }

  // get user time entries
  getUserEntries(token, userID) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    parameters = parameters.append('userID', userID);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserTimeEntries',{
      params: parameters,
      headers: headers
    });
  }

  // get all user time entries
  getAllUserEntries(token) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getAllUsersTimeEntries', {
      headers: headers
    });
  }

  // get all project time entries
  getAllProjectEntries(token, projectID) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    parameters = parameters.append('projectID', projectID);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getProjectTimeEntries', {
      params: parameters,
      headers: headers
    });
  }

  // import time entry
  import(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'userTimeEntry/importTimeEntry', JSON.stringify(values), {
      headers: headers
    });
  }
}
