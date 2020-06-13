import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { summaryFileName } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    const signIn = document.getElementById("sign_in");
    const signUp = document.getElementById("sign_up");


    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

    signUp.addEventListener('click', () => {
      this.callServer
    });

    signIn.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
  }
 
  callServer() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConf = document.getElementById('passwordConfirm');
    const surname = document.getElementById('surname');

    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    this.http.post('http://127.0.0.1:3000', JSON.stringify({
      "name": name, "surname": surname}), {
      headers: headers
    })
    .subscribe(data => {
      console.log(data);
    });
  }

}
