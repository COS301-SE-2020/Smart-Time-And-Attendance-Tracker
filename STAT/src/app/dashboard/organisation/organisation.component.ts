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

  requests : []

  ngOnInit(): void {
    this.getAllUnauthenticatedUsers('n')
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

  getAllUnauthenticatedUsers(sort : string) 
  {
    this.requests = null
    this.service.getUnathenticatedUsers(localStorage.getItem('token')).subscribe((data) => {
      this.requests = data['UnauthenticatedUsers'];
      this.sortRequests(sort)
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
          a.name.localeCompare(b.name) || a.email.localeCompare(b.email)
        );
        break;

      case 'o' :
        break;

      case 'n' :
        this.requests.reverse()
        break;
    }
  }
}
