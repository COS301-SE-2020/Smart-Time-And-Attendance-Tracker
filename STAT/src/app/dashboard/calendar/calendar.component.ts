import { Component, OnInit,
         ChangeDetectionStrategy,
         ChangeDetectorRef } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {

  authorised : any;
  src : string;

  private email;
  private clientID;
  private ROOT_URL = "http://localhost:3000/api/";
  public roles = localStorage.getItem('roles');

  constructor(public http: HttpClient, public headerService : HeaderService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // console.log(gapi.auth2.getAuthInstance());
    // console.log(gapi.auth2);

    if (gapi.auth2.getAuthInstance() != undefined && gapi.auth2.getAuthInstance() != null)
      this.authenticate(gapi.auth2.getAuthInstance());
    else if (gapi.auth2 != undefined)
      this.checkAuth();
    else
      this.authorised = false;
  }

  //check if authenticated, authenticate if not
  checkAuth() {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
    let parameters = new HttpParams();
    parameters = parameters.append('calendar','google');
     this.http.get(this.ROOT_URL+'calendar/getCredentials', {
      headers: headers,
      params: parameters
    }).subscribe((data) => {
      this.clientID = data['clientId'];
      gapi.client.setApiKey(data['apiKey']);
      gapi.auth2.authorize({client_id: data['clientId'], scope: data['scopes'],response_type: "token id_token" },(this.makeApiCall).bind(this) );
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  authenticate(auth) {
    console.log(auth);
    if (auth != null) {
      this.authorised = true;
      this.cd.detectChanges();
      this.email = auth.currentUser.get().getBasicProfile().getEmail();
      document.getElementById("calendar-frame").setAttribute("src", "https://calendar.google.com/calendar/embed?src=" + this.email);
    }
    else {
      this.authorised = false;
      this.cd.detectChanges();
    }
  }

  makeApiCall(authResult) {
      gapi.load('auth2', () => {
        gapi.auth2.init({client_id: this.clientID}).then((this.authenticate).bind(this));
      });
    console.log(authResult);
    var that = this;
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
    var params =  {calendar :"google", accessToken: authResult.access_token ,expiryDate: authResult.expires_at,tokenType: authResult.token_type };
     that.http.post(this.ROOT_URL+'calendar/syncEvents',JSON.stringify(params), {
      headers: headers
    }).subscribe((data) => {
      console.log(data);
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
}
