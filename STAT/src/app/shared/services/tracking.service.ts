import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(public http: HttpClient) { }
  private ROOT_URL = "http://localhost:3000/api/";
  EntryID : string

  // Add manual time entry
  public addMTimeEntry(values, token) {
    let epoch = new Date(values.date +" " +values.startTime).getTime();
    values.startTime = epoch;
    epoch = new Date(values.date +" " +values.endTime).getTime();
    values.endTime = epoch;
    if(!values.description)
      values.description = "Manual Entry";
    values.device = "Website";
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.post(this.ROOT_URL+'userTimeEntry/addTimeEntry', JSON.stringify(values), {
      headers: headers
    });
  }
  //Add "automatic" time entry
  public addATimeEntry(values, token) {
    if(!values.description)
      values.description = "Timed Entry";
    values.device = "Website";
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.post(this.ROOT_URL+'userTimeEntry/addTimeEntry', JSON.stringify(values), {
      headers: headers
    });
  }
  //Update time entry
  public updateTimeEntry(values, token) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'userTimeEntry/updateTimeEntry', JSON.stringify(values), {
      headers: headers
    });
  }
  //Get user's projects and tasks
  public getProjectsAndTasks(values){
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+values);
    return this.http.get(this.ROOT_URL+ 'user/getProjects', {
      headers: headers
    });
  }
  public saveSharedLocalStorage(iframe, saveKey, data)
  { 
    iframe.contentWindow.postMessage({
      action: 'save',
      key: saveKey,
      value: data
  });
}
public getSharedLocalStorage(iframe,getKey)
  {
    console.log("gettttt"+ getKey);
      return iframe.contentWindow.postMessage({
      action: 'get',
      key: getKey
  });
}
}
