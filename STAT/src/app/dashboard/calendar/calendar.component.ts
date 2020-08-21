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

  loading = true;
  authorised = false;
  src : string;
  storedAuthResult : any;

  private email;
  private user;
  private clientID;
  private ROOT_URL = "http://localhost:3000/api/";
  public roles = localStorage.getItem('roles');

  constructor(public http: HttpClient, public headerService : HeaderService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
    let parameters = new HttpParams();
    parameters = parameters.append('calendar','google');
     this.http.get(this.ROOT_URL+'calendar/getCredentials', {
      headers: headers,
      params: parameters
    }).subscribe((data) => {
      this.clientID = data['clientId'];
      gapi.load('auth2', () => {
        gapi.client.setApiKey(data['apiKey']);
        gapi.auth2.init({client_id: this.clientID,scope: data['scopes'][0]}).then((this.checkLoggedIn).bind(this));
      });
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  //check if logged in to display screen
  checkLoggedIn(auth) {console.log('PIG');
  this.loading = false;
   this.authorised =  auth.isSignedIn.get();
   console.log(this.authorised);
    if(this.authorised == true)
      this.authenticate(auth);
  }

  //check if authenticated, authenticate if not
  checkAuth() {
    this.loading = true;
    this.cd.detectChanges();
    /////
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
      gapi.load('auth2', () => {
        gapi.auth2.init({client_id: this.clientID,scope: data['scopes'][0]}).then((this.handleAuthResult).bind(this));
      });
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }


  handleAuthResult(authResult) {
    authResult.signIn().then((this.authenticate2).bind(this));
  }

  authenticate(auth) { //GoogleAuth
    this.user = auth.currentUser.get();
    if (auth && !auth.error) {
      this.authorised = true;
      this.cd.detectChanges();
      this.loading = false;
      this.cd.detectChanges();
      this.email = auth.currentUser.get().getBasicProfile().getEmail();
      document.getElementById("calendar-frame").setAttribute("src", "https://calendar.google.com/calendar/embed?src=" + this.email);
      var authResult = this.user .getAuthResponse();
      this.makeApiCall(authResult);

    }
    else {
      this.authorised = false;
      this.cd.detectChanges();
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  authenticate2(auth) { //GoogleUser
    this.user = auth;
    if (auth && !auth.error) {
      this.authorised = true;
      this.cd.detectChanges();
      this.loading = false;
      this.cd.detectChanges();
      this.email = auth.getBasicProfile().getEmail();
      document.getElementById("calendar-frame").setAttribute("src", "https://calendar.google.com/calendar/embed?src=" + this.email);
      var authResult = this.user.getAuthResponse();
      this.makeApiCall(authResult);
    }
    else {
      this.authorised = false;
      this.cd.detectChanges();
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  refresh() {
    var authResult = this.user.getAuthResponse();
    this.makeApiCall(authResult);
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
