import { Component, OnInit } from '@angular/core';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.sass']
})
export class OrganisationComponent implements OnInit {

  constructor(public headerService : HeaderService, public service : AccountManagementService) { }

  panelOpenState = false;

  requests : Object[]
  members : []
  membersResult : any
  searchText : string = null
  searchMem : string = null

  ngOnInit(): void {
    this.getAllUnauthenticatedUsers('n')
    this.getMembers()
  }

  authenticateUser(id)
  {
    let req = {"userID": id};
    this.service.authenticate(localStorage.getItem('token'), req).subscribe((data) => {
      this.getAllUnauthenticatedUsers('n')
      this.getMembers()
    },
    error => {
      //console.log(error);
      //console.log(error.error.message);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  rejectUser(id)
  {
    let req = {"userID": id};
    this.service.reject( localStorage.getItem('token'), req).subscribe((data) => {
      this.getAllUnauthenticatedUsers('n')
      this.getMembers()
    },
    error => {
      //console.log(error);
      //console.log(error.error.message);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  getAllUnauthenticatedUsers(sort : string)
  {
    this.requests = null
    this.service.getUnauthenticatedUsers(localStorage.getItem('token')).subscribe((data) => {
      this.requests = data['unauthenticatedUsers'];
      this.sortRequests(sort)
    },
    error => {
      //console.log(error);
      //console.log(error.error.message);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
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
      this.groupAndSort(this.members)
    },
    error => {
      //console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  // search members
  searchMembers(text : string) {
    if (!this.searchMem)
      this.groupAndSort(this.members)
    let d : any[] = new Array()
    d = this.members.filter((x : any) =>
      x['name'].toLowerCase().includes(text.toLowerCase()) ||
      x['surname'].toLowerCase().includes(text.toLowerCase()) ||
      x['email'].toLowerCase().includes(text.toLowerCase())
    )
    this.groupAndSort(d)
  }

  // group and sort members
  groupAndSort(data : any[]) {
    // sort members
    data.sort((a : any ,b : any) =>
      a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname) || a.email.localeCompare(b.email)
    );

    // group alphabetically
    let grouped = data.reduce((r : any, e : any) => {
      // get first letter of name of current element
      let alphabet = e.name.toUpperCase()[0];
    
      // if there is no property in accumulator with this letter create it
      if (!r[alphabet]) r[alphabet] = { alphabet, records: [e] }
    
      // if there is push current element to children array for that letter
      else r[alphabet].records.push(e);
    
      // return accumulator
      return r;
    }, {});
    
    this.membersResult = Object.values(grouped)
  }

  // filter members
  filterMem(alphabet : string) {
    let lists = document.getElementsByClassName('member-list')
    // if # then show all lists
    if (alphabet == '#') {
      for (let i = 0; i < lists.length; i++)
        lists[i].removeAttribute('hidden')
    } else {
      for (let i = 0; i < lists.length; i++)
        lists[i].setAttribute('hidden', 'true')

      // list to be displayed
      let list = document.getElementById(alphabet)
      if (list)
        list.hidden = false
    }

    // set active letter
    let alpha = document.getElementById('alphabet').children
    let i = 0
    let active = null
    let remove = null

    // remove class from previous letter
    while (!remove) {
      if (alpha[i].classList.contains('active')) {
        remove = alpha[i]
        remove.classList.remove('active')
      }
      i++
    }
    i = 0

    // add class to new letter
    while (!active) {
      if (alpha[i].innerHTML == alphabet) {
        console.log(alpha[i])
        active = alpha[i]
        active.classList.add('active')
      }
      i++
    }
  }
}
