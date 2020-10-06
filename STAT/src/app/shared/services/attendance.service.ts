import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private ROOT_URL = "http://localhost:3000/api/";
  public roles = localStorage.getItem('roles');
  constructor(public http: HttpClient) { }

  getOwnAttendanceEntries(token, values) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Authorization', "Bearer " + token);
    return this.http.get(this.ROOT_URL + 'attendance/getOwnAttendanceEntries', {
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

  getIOTAttendanceEntries(token, values) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Authorization', "Bearer " + token);
    let parameters = new HttpParams();
    parameters = parameters.append('deviceID', values.deviceID);
    if (values.minDate) {
      parameters = parameters.append('minDate', values.minDate);
      parameters = parameters.append('maxDate', values.maxDate);
    }
    return this.http.get(this.ROOT_URL + 'attendance/getIOTAttendanceEntries', {
      params: parameters,
      headers: headers
    });
  }

  getAllUsersAttendanceEntries(token) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set('Authorization', "Bearer " + token);
    return this.http.get(this.ROOT_URL + 'attendance/getAllUsersAttendanceEntries', {
      headers: headers
    });
  }
}
