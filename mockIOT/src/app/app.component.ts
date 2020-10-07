import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

class User {
  public id: string;
  public tracking: boolean;
  public trackingID: string;
  
  constructor(id: string) {
    this.id = id;
    this.tracking = false;
  }

  toggle() {
    this.tracking = !this.tracking;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'mockIOT';
  private users = [];
  private deviceID = "5f3d860b805adb2978bc5612";
  private ROOT_URL = "http://localhost:3000/api/";

  constructor(public http: HttpClient) {
    this.users['Vianka'] = new User("5f22b835dc9bb242f4e27a79");
    this.users['Jana'] = new User("5f22e40769e3286568da894c");
    this.users['Jesse'] = new User("5f22e51469e3286568da894d");
    this.users['Mushi'] = new User("5f22e51469e3286568da894d");
    this.users['Vedha'] = new User("5f22e51469e3286568da894d");
    }

  tracking(user: string)
  {
    if(!this.users[user].tracking)
    {
      var obj = {"deviceID": this.deviceID, "userID": this.users[user].id};
        const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
      this.http.post(this.ROOT_URL+'iotDevice/startTimer',JSON.stringify(obj), {
        headers: headers,
      }).subscribe((data) => { 
        console.log("Tracking started for "+ user);
        this.users[user].trackingID = data['timeEntryID'];  
        this.users[user].tracking = true;   
      },
      error => {
        console.log(error);
        
      });
    }

    else
    {
      var obj2 = {"deviceID": this.deviceID, "userID": this.users[user].id, "timeEntryID": this.users[user].trackingID};
        const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
      this.http.post(this.ROOT_URL+'iotDevice/stopTimer',JSON.stringify(obj2), {
        headers: headers,
      }).subscribe((data) => { 
        console.log("Tracking stopped for "+ user);
        this.users[user].trackingID = null;  
        this.users[user].tracking = false; 
       },
      error => {
        console.log(error);
        
      });
    }

  }
}
