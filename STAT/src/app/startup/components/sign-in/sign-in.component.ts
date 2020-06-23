import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  signUpForm : FormGroup
  signInForm : FormGroup

  constructor(public service : AccountManagementService, public router : Router) { }

  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    const signIn = document.getElementById("sign_in");

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

    signIn.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

    // sign up form
    this.signUpForm = new FormGroup({
      name : new FormControl('', [Validators.required]),
      surname : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConf : new FormControl('', [Validators.required])
    });

    this.signUpForm.setValidators(this.MustMatch('password', 'passwordConf'));

    // sign in form
    this.signInForm = new FormGroup({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }
 
  /**************
  FORM VALIDATION
  ***************/

  // get form control
  get su() { return this.signUpForm.controls; }
  get si() { return this.signInForm.controls; }

  // display errors for email
  getEmailError() {
    if (this.signUpForm.controls.email.hasError('required')) {
      return 'Please enter a value';
    }

    return this.signUpForm.controls.email.hasError('email') ? 'Invalid email address' : '';
  }

  // display errors for password
  getPassError() {
    if (this.signUpForm.controls.password.hasError('required')) {
      return 'Please enter a value';
    }

    return this.signUpForm.controls.password.hasError('minlength') ? 'Invalid password length' : '';
  }

  // display errors for confirm password
  getConfError() {
    if (this.signUpForm.controls.passwordConf.hasError('required')) {
      return 'Please enter a value';
    }

    return this.signUpForm.controls.passwordConf.hasError('mustMatch') ? 'Passwords do not match' : '';
  }

  // validate that passwords match
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }

        return null;
    }
  }

  /********
  API CALLS
  *********/
  
  // submit sign up form
  signUp(form : NgForm) {
    console.log(form);
    this.service.signUp(form);
    this.router.navigate(['main']);
    localStorage.setItem('loggedIn', 'true');
  }

  //submit sign in form
  signIn(form : NgForm) {
    console.log(form);
    this.service.signIn(form).subscribe( (value) =>
      {
        console.log(value);
        if(value == "Success")
        {
          this.router.navigate(['main']);
          localStorage.setItem('loggedIn', 'true');
        }
        else{

        }
    });
  }
}
