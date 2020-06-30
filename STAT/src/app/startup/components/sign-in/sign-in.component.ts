import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  signUpForm : FormGroup
  signInForm : FormGroup
  signUpError : string
  signInError : string
  
  constructor(public service : AccountManagementService, public router : Router, private headerService : HeaderService) { }

  ngOnInit(): void {
     const signUpButton = document.getElementById('signUp');
     const signInButton = document.getElementById('signIn');
     const container = document.getElementById('container');

    //const signIn = document.getElementById("sign_in");

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

    /*signIn.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });*/

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

  // SIGN UP
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

  // SIGN IN
  // display errors for email
  getEmailErrorSI() {
    if (this.signInForm.controls.email.hasError('required')) {
      return 'Please enter a value';
    }

    return this.signInForm.controls.email.hasError('email') ? 'Invalid email address' : '';
  }

  // display errors for password
  getPassErrorSI() {
    if (this.signInForm.controls.password.hasError('required')) {
      return 'Please enter a value';
    }

    return this.signInForm.controls.password.hasError('minlength') ? 'Invalid password length' : '';
  }


  /********
  API CALLS
  *********/
  
  // submit sign up form
  signUp(form : NgForm) {
    this.service.signUp(form).subscribe(data => {
      localStorage.setItem('token', data['token']);
      localStorage.setItem('roles', data['roles']);
      localStorage.setItem('loggedIn', 'true');
      this.headerService.isUserLoggedIn.next(true);
      this.service.getRoles({token :  localStorage.getItem('token')}).subscribe(res => {
      console.log(res['roles']);
      localStorage.setItem('roles', res['roles']);
      this.router.navigate(['main']);
      })
    },
    error => {
      //console.log(error.error.message);  
      localStorage.setItem('loggedIn', 'false');
      this.signUpError = error.error.message;
    }); 
  }
  //submit sign in form
  signIn(form : NgForm) {
    this.service.signIn(form).subscribe(data => {
      localStorage.setItem('token', data['token']);
      localStorage.setItem('roles', data['roles']);
      localStorage.setItem('loggedIn', 'true');
      this.headerService.isUserLoggedIn.next(true);
      this.service.getRoles({token :  localStorage.getItem('token')}).subscribe(res => {
      console.log(res['roles']);
      localStorage.setItem('roles', res['roles']);
      this.router.navigate(['main']);
      })
    },
    error => {
      localStorage.setItem('loggedIn', 'false'); 
      this.signInError = error.error.message;  
    }); 
  }

}
