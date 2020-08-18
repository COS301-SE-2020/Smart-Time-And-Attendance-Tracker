import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {

  authorised : any;

  private ROOT_URL = "http://localhost:3000/api/";

  public roles = localStorage.getItem('roles');

  constructor(public http: HttpClient, public headerService : HeaderService) { }

  ngOnInit(): void {
    this.authorised = false;
    this.checkAuth();
  }
  
  //check if authenticated
  checkAuth() {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
    let parameters = new HttpParams();
    parameters = parameters.append('calendar','google');
     this.http.get(this.ROOT_URL+'calendar/getCredentials', {
      headers: headers,
      params: parameters
    }).subscribe((data) => {
      gapi.client.setApiKey(data['apiKey']);
      gapi.auth2.authorize({client_id: data['clientId'], scope: data['scopes'][0]},(this.makeApiCall).bind(this) );
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }


  makeApiCall(authResult) {
    var that = this;
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
    var params =  {calendar :"google", accessToken: authResult.access_token ,expiryDate: authResult.expires_at,tokenType: authResult.token_type };
     that.http.post(this.ROOT_URL+'calendar/syncEvents',JSON.stringify(params), {
      headers: headers
    }).subscribe((data) => {
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  
  }
}
