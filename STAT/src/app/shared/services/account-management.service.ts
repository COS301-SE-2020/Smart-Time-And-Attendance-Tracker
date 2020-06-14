import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AccountManagementService {

  public static token :string;
  public static roles: Array<{id: number, text: string}>
  constructor(private http: HttpClient) { }

  // sign up
  public signUp(values) {
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    this.http.post('http://127.0.0.1:3000', JSON.stringify(values), {
      headers: headers
    })
    .subscribe(data => {
      console.log(data);
    });
  }

  // sign in 
  public signIn() {

  }

  // edit profile

  // edit settings

  // sign out

  // delete account
}
