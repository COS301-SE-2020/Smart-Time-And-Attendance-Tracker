import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

  constructor(public http: HttpClient) { }

  private ROOT_URL = "http://localhost:3000/api/";

  //add a task
  public addTask(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    values.dueDate = formatDate(values.dueDate, 'yyyy/MM/dd', 'en');
    values.startDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    return this.http.post(this.ROOT_URL+'project/addTask', JSON.stringify(values), {
      headers: headers
    });
  }
  //add a project
  public addProject(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    values.dueDate = formatDate(values.dueDate, 'yyyy/MM/dd', 'en');
    values.startDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    return this.http.post(this.ROOT_URL+'project/add', JSON.stringify(values), {
      headers: headers
    });
  }
  //delete a task
  public deleteTask(token, task, project) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    parameters = parameters.append('taskID', task);
    parameters = parameters.append('projectID', project);
    return this.http.delete(this.ROOT_URL+'task', {
      headers: headers,
      params: parameters
    });
  }
  //delete project
  public deleteProject(token, project) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    let parameters = new HttpParams();
    parameters = parameters.append('projectID', project);
    return this.http.delete(this.ROOT_URL+'project', {
      headers: headers,
      params: parameters
    });
  }
  public editTask(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);

    return this.http.post(this.ROOT_URL+'task/update', JSON.stringify(values), {
      headers: headers
    });
  }
  //add a project
  public editProject(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'project/update', JSON.stringify(values), {
      headers: headers
    });
  }

  //mark project as completed
  public completeProject(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'project/complete', JSON.stringify(values), {
      headers: headers
    });
  }

  //mark task as completed
  public completeTask(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'task/complete', JSON.stringify(values), {
      headers: headers
    });
  }

  //mark task as started
  public startTask(token, values) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+token);
    return this.http.post(this.ROOT_URL+'task/start', JSON.stringify(values), {
      headers: headers
    });
  }
}
