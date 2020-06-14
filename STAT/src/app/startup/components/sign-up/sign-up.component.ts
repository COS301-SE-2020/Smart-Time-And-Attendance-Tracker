import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {

  constructor(public service : AccountManagementService) { }
  
  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
  }
  
  // submit sign up form
  signUp(form : NgForm) {
    console.log(form.value);
    this.service.signUp(form.value);
  }

  //submit sign in form
  signIn(form : NgForm) {
    console.log(form.value);
    this.service.signIn(form.value);
  }
}
