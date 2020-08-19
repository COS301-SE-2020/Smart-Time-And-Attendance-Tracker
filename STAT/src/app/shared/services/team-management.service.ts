import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {

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

  // Create team (Team leader)
  public createTeam(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/add', JSON.stringify(values), {
      headers: headers
    });
  }
  // get all teams
  public getTeams(token) {
      const headers = new HttpHeaders()
            .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
      return this.http.get(this.ROOT_URL+'team/getTeams', {
        headers: headers
      });
  }
  // Add team member (Team leader)
  public addTeamMember(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/addTeamMember', JSON.stringify(values), {
      headers: headers
    });
  }
  // Remove team member (Team leader)
  public removeTeamMember(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/removeTeamMember', JSON.stringify(values), {
      headers: headers
    });
  }
  // Change role in team (Team leader)
  public changeRole(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/changeRole', JSON.stringify(values), {
      headers: headers
    });
  }
  // Edit team (Team leader)
  public editTeam(token, values) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    return this.http.post(this.ROOT_URL+'team/editTeam', JSON.stringify(values), {
      headers: headers
    });
  }
  // Delete team (Team leader)
  public deleteTeam(token, teamID) {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json').set('Authorization', 'Bearer '+token);
    let parameters = new HttpParams();
    parameters = parameters.append('teamID', teamID);
    return this.http.delete(this.ROOT_URL+'team?', {
      headers: headers,
      params: parameters
    });
  }

// end service
}
