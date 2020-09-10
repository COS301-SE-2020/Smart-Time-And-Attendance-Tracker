import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private ROOT_URL = "http://localhost:3000/api/";

  constructor(public http: HttpClient) { }

  //Get user's daily totals for the last week
  public getDailyValues(key){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserDailyTotalTime', {
      headers: headers
    });
  }

  //Get project's daily totals for the last week
  public getProjectDailyValues(key, pID){
    let parameters = new HttpParams();
    parameters = parameters.append('projectID', pID);
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getProjectDailyTotalTime', {
      headers: headers,
      params:parameters
    });
  }

  //Get user's daily monetary value totals for the last week
  public getDailyMoney(key){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserDailyTotalMoney', {
      headers: headers
    });
  }

  //Get user's time for each project for the last week
  public getWeeklyProjectsTimes(key){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserWeeklyTimeForProjects', {
      headers: headers
    });
  }

  //Get user's time for each task for the last week
  public getWeeklyTasksTimes(key){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserWeeklyTimeForTasks', {
      headers: headers
    });
  }

  //Get devices user used for the last week
  public getDevices(key){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getUserDevices', {
      headers: headers
    });
  }

  //Get the amount of time each user spent on the project for the last week
  public getProjectMembersTotalTime(key, pID){
    let parameters = new HttpParams();
    parameters = parameters.append('projectID', pID);
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+key);
    return this.http.get(this.ROOT_URL+ 'userTimeEntry/getProjectMembersTotalTime', {
      headers: headers,
      params:parameters
    });
  }
}
