import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-unauthorised',
  templateUrl: './unauthorised.component.html',
  styleUrls: ['./unauthorised.component.sass']
})
export class UnauthorisedComponent implements OnInit {

  constructor(public service: AccountManagementService, public router: Router) { }

  ngOnInit(): void {
    this.service.isAuthenticated(localStorage.getItem('token')).subscribe(res => {
      if (res['authenticated'])
        this.router.navigate(['main']);
      else
        this.router.navigate(['unauthorised']);
    },
      error => {
        //console.log(error);
      });
  }

}
