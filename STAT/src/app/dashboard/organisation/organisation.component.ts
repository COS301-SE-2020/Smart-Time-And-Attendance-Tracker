import { Component, OnInit } from '@angular/core';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.sass']
})
export class OrganisationComponent implements OnInit {

  constructor(public service : AccountManagementService) { }

  panelOpenState = false;

  requests : Object[]
  members : []
  searchText : string = null

  ngOnInit(): void {
    this.getAllUnauthenticatedUsers('n')
    this.getMembers()
  }

  authenticateUser(id)
  {
    let req = {"userID": id};
    this.service.authenticate(localStorage.getItem('token'), req).subscribe((data) => {
      console.log(data);
      this.getAllUnauthenticatedUsers('n')
      this.getMembers()
    },
    error => {
      console.log(error);
      //console.log(error.error.message);  
    
    }); 
  }

  rejectUser(id)
  {
    let req = {"userID": id};
    this.service.reject( localStorage.getItem('token'), req).subscribe((data) => {
      console.log(data);
      this.getAllUnauthenticatedUsers('n')
      this.getMembers()
    },
    error => {
      console.log(error);
      //console.log(error.error.message);  
    
    }); 
  }

  getAllUnauthenticatedUsers(sort : string) 
  {
    this.requests = null
    this.service.getUnauthenticatedUsers(localStorage.getItem('token')).subscribe((data) => {
      this.requests = data['unauthenticatedUsers'];
      this.sortRequests(sort)
      console.log(this.requests)
    },
    error => {
      console.log(error);
      //console.log(error.error.message);  
    
    }); 
  }

  sortRequests(selection : string) {
    switch (selection) {
      case 'a' :
        this.requests.sort((a : any ,b : any) =>
          a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname) || a.email.localeCompare(b.email)
        );
        break;

      case 'o' :
        break;

      case 'n' :
        this.requests.reverse()
        break;
    }
  }

  searchRequests(text : string) {
    if (!this.searchText)
      return this.requests
    return this.requests.filter((x : any) => 
      x['name'].toLowerCase().includes(text.toLowerCase()) ||
      x['surname'].toLowerCase().includes(text.toLowerCase()) ||
      x['email'].toLowerCase().includes(text.toLowerCase())
    )
  }

  getMembers() {
    this.service.getAllUsers(localStorage.getItem('token')).subscribe((data) => {
      this.members = data['users'];
    },
    error => {
      console.log(error);
    }); 
  }
}
