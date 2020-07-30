import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TeamsManagementService {

  constructor(public http: HttpClient) { }
  private ROOT_URL = "http://localhost:3000/api/";

  // template
  /*public function(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'subsystem/function', JSON.stringify(values), {
      headers: headers
    });
  }*/

  // create team
  public addTeam(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/add', JSON.stringify(values), {
      headers: headers
    });
  }
  // get all teams
  public getTeams() {
      const headers = new HttpHeaders()
            .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
      return this.http.post(this.ROOT_URL+'team/add', {
        headers: headers
      });
  }
  // add team member
  public addTeamMember(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/addTeamMember', JSON.stringify(values), {
      headers: headers
    });
  }
  // remove team member
  public removeTeamMember(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/removeTeamMember', JSON.stringify(values), {
      headers: headers
    });
  }
  // change role in team
  public changeRole(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/changeRole', JSON.stringify(values), {
      headers: headers
    });
  }

// end service
}
