import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(public http: HttpClient) { }

  // sign up
  public addTimeEntry(values, token) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.post('http://localhost:3000/api/userTimeEntry/addTimeEntry', JSON.stringify(values), {
      headers: headers
    });
  }
  
}
