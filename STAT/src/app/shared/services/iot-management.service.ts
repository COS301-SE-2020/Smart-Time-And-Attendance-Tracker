import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IotManagementService {

  private ROOT_URL = "http://localhost:3000/api/";

  constructor(public http: HttpClient) { }

  registerDevice(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.post(this.ROOT_URL+ 'iotDevice/register', JSON.stringify(values),{
      headers: headers
    });
  }

  deregisterDevice(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.post(this.ROOT_URL+ 'iotDevice/deregister', JSON.stringify(values),{
      headers: headers
    });
  }

  getDevices(token) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.get(this.ROOT_URL+ 'iotDevice/getAllDevices', {
      headers: headers
    });
  }
}
