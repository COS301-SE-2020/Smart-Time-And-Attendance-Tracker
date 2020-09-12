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
    this.users['Zendaya'] = new User("5f22b835dc9bb242f4e27a79");
    this.users['Henry'] = new User("5f22e40769e3286568da894c");
    this.users['Zac'] = new User("5f22e51469e3286568da894d");
    }

  tracking(user)
  {
    if(this.users[user.id].tracking)
    {
      var obj = {"deviceID": this.deviceID, "userID": user.id};
        const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
      this.http.post(this.ROOT_URL+'iotDevice/startTimer',JSON.stringify(obj), {
        headers: headers,
      }).subscribe((data) => { 
        console.log(data);
        this.users[user.id].trackingID = data['timeEntryID'];     
      },
      error => {
        console.log(error);
        
      });
    }

    else
    {
      var obj2 = {"deviceID": this.deviceID, "timeEntryID": this.users[user.id].trackingID};
        const headers = new HttpHeaders()
      .set('Content-Type', 'application/json').set( 'Authorization', "Bearer "+localStorage.getItem('token'));
      this.http.post(this.ROOT_URL+'iotDevice/stopTimer',JSON.stringify(obj2), {
        headers: headers,
      }).subscribe((data) => { 
        console.log(data);  
      },
      error => {
        console.log(error);
        
      });
    }

  }
}
