import { Component, OnInit } from '@angular/core';
declare var gapi: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {

  authorised : any;

  constructor() { }

  ngOnInit(): void {
    this.authorised = false;
    gapi
    this.checkAuth();
  }

  checkAuth() {
    const http = new XMLHttpRequest();
    var apiURL = "http://localhost:3000/api/calendar/getCredentials?"+ "calendar=google";
    http.open("GET",apiURL , true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("Authorization", "Bearor "+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMjJiODM1ZGM5YmIyNDJmNGUyN2E3OSIsImlhdCI6MTU5NzQ4ODQyMywiZXhwIjoxNTk3NTc0ODIzfQ.v0mxh5Yp_iY9aOqc7uLHyrLTWZxtigbqdB4BKWH8PyI");
    http.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        gapi.client.setApiKey(response.apiKey);
        gapi.auth.authorize({client_id: response.clientId, scope: response.scopes, immediate: true}, this.handleAuthResult);
      }
      else if(this.readyState == 4)
        console.log(response);
        //document.getElementById('error').innerHTML = response.message;
    }
    http.send();
  }

  handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
      authorizeButton.style.visibility = 'hidden';
      this.makeApiCall(authResult);
    } else {
      authorizeButton.style.visibility = '';
      authorizeButton.onclick = this.handleAuthClick;
    }
  }

  handleAuthClick(event) {
    const http = new XMLHttpRequest();
    var apiURL = "http://localhost:3000/api/calendar/getCredentials?calendar=google";
    http.open("GET",apiURL , true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("Authorization", "Bearor "+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMjJiODM1ZGM5YmIyNDJmNGUyN2E3OSIsImlhdCI6MTU5NzQ4ODQyMywiZXhwIjoxNTk3NTc0ODIzfQ.v0mxh5Yp_iY9aOqc7uLHyrLTWZxtigbqdB4BKWH8PyI");
    http.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        gapi.auth.authorize({client_id: response.clientId, scope: response.scopes, immediate: false}, this.handleAuthResult);
      }
      else if(this.readyState == 4)
        console.log(response);
        //document.getElementById('error').innerHTML = response.message;
    }
    http.send();
    return false;
  }

  makeApiCall(authResult) {
    const http = new XMLHttpRequest();
    var apiURL = "http://localhost:3000/api/calendar/syncEvents" ;
    var params =  {calendar :"google", accessToken: authResult.access_token ,expiryDate: authResult.expires_at,tokenType: authResult.token_type };

    http.open("POST",apiURL , true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("Authorization", "Bearor "+ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMjJiODM1ZGM5YmIyNDJmNGUyN2E3OSIsImlhdCI6MTU5NzQ4ODQyMywiZXhwIjoxNTk3NTc0ODIzfQ.v0mxh5Yp_iY9aOqc7uLHyrLTWZxtigbqdB4BKWH8PyI");
    http.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        console.log(response);
        var response = JSON.parse(this.responseText);
      }
      else if(this.readyState == 4)
        //document.getElementById('error').innerHTML = response.message;
        console.log(response.message);
    }
    http.send(JSON.stringify(params));
  }
}
