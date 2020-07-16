import { Component, OnInit } from '@angular/core';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.sass']
})
export class OrganisationComponent implements OnInit {

  constructor(public service : AccountManagementService) { }

  panelOpenState = false;

  requests : any

  ngOnInit(): void {
    this.requests = this.getAllUnauthenticatedUsers()
  }

authenticateUser(id)
{
  let req = {"UserID": id};
  this.service.authenticate(req, localStorage.getItem('token')).subscribe((data) => {
    console.log(data);
  },
  error => {
    console.log(error);
    //console.log(error.error.message);  
  
  }); 
}
rejectUser(id)
{
  let req = {"UserID": id};
  this.service.reject(req, localStorage.getItem('token')).subscribe((data) => {
    console.log(data);
  },
  error => {
    console.log(error);
    //console.log(error.error.message);  
  
  }); 
}
getAllUnauthenticatedUsers()
{
  this.service.getUnathenticatedUsers(localStorage.getItem('token')).subscribe((data) => {
    console.log(data['UnauthenticatedUsers']);
    this.requests = data['UnauthenticatedUsers'];
  },
  error => {
    console.log(error);
    //console.log(error.error.message);  
  
  }); 
}
}
