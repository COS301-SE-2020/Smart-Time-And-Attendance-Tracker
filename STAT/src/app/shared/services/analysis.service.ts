import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private ROOT_URL = "http://localhost:3000/api/";

  constructor(public http: HttpClient) { }

  //Get user's projects and tasks
  public getDailyValues(key){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserDailyTotalTime', {
      headers: headers
    });
  }

  //Get user's projects and tasks
  public getProjectDailyValues(key, pID){
    let parameters = new HttpParams();
    parameters = parameters.append('projectID', pID);
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getProjectTotalDailyTime', {
      headers: headers,
      params:parameters
    });
  }
}
