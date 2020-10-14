import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private ROOT_URL = "https://stat-server.azurewebsites.net/api/";

  public roles = localStorage.getItem('roles');

  constructor(public http: HttpClient) { }

  // get own time entries
  getOwnEntries(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getOwnTimeEntries', {
      params: parameters,
      headers: headers
    });
  }

  // get user time entries
  getUserEntries(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    parameters = parameters.append('userID', values.userID);
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
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
  getAllProjectEntries(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    parameters = parameters.append('projectID', values.projectID);
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
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
