import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private ROOT_URL = "https://stat-server.azurewebsites.net/api/";
  public roles = localStorage.getItem('roles');
  constructor(public http: HttpClient) { }

  getOwnAttendanceEntries(token, values) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Authorization', "Bearer " + token);
    let parameters = new HttpParams();
    parameters = parameters.append('deviceID', values.deviceID);
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
    return this.http.get(this.ROOT_URL + 'attendance/getOwnAttendanceEntries', {
      params: parameters,
      headers: headers
    });
  }

  getUserAttendanceEntries(token, values) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Authorization', "Bearer " + token);
    let parameters = new HttpParams();
    parameters = parameters.append('userID', values.userID);
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
    return this.http.get(this.ROOT_URL + 'attendance/getUserAttendanceEntries', {
      params: parameters,
      headers: headers
    });
  }

  getAllUsersAttendanceEntries(token, values) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Authorization', "Bearer " + token);
    let parameters = new HttpParams();
    parameters = parameters.append('deviceID', values.deviceID);
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
    return this.http.get(this.ROOT_URL + 'attendance/getAllUsersAttendanceEntries', {
      params: parameters,
      headers: headers
    });
  }
}
