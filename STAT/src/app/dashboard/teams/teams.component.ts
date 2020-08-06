import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TeamManagementService } from 'src/app/shared/services/team-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.sass']
})
export class TeamsComponent implements OnInit {

  constructor(private modalService: NgbModal, public headerService : HeaderService, public tmService: TeamManagementService, public amService : AccountManagementService) { }

  panelOpenState = false;
  roles : string

  addMemberForm : FormGroup
  teams : Object[]
  tid : string
  teamName : string
  members : Object[]
  mid : string
  memberName : string

  searchMem : string = null
  allMembers : any[]
  searchedMembers : any[]
  addMembers : Object[] = []
  role : string
  pid : string

  availMembers : any[] = []

  error : string

  ngOnInit(): void {
    // page setup
    this.roles = localStorage.getItem('roles');
    
    // add member form
    this.addMemberForm = new FormGroup({
      userID : new FormControl(''), // ??
      projectID : new FormControl('')
    });

    this.getTeams();
    this.getAllMembers();
  }

  /*** API CALLS ***/

  // get all members
  getAllMembers() {
    this.amService.getAllUsers(localStorage.getItem('token')).subscribe((data) => {
      this.allMembers = data['users'];
      // sort alphabetically
      this.allMembers.sort((a : any ,b : any) =>
        a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname) || a.email.localeCompare(b.email)
      );
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

  // get all teams
  getTeams() {
    this.tmService.getTeams(localStorage.getItem('token')).subscribe((data) => {
      this.teams = data['teams']
      this.teams.sort((a : any ,b : any) =>
          a.teamName.localeCompare(b.teamName)
      );
      console.log(this.teams)
      this.getMembers();
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
      this.error = error.statusText
    });
  }

  // get members
  getMembers() {
    this.amService.getAllUsers(localStorage.getItem('token')).subscribe((data) => {
      this.allMembers = data['users'];
      // sort alphabetically
      this.allMembers.sort((a : any ,b : any) =>
        a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname) || a.email.localeCompare(b.email)
      );
      this.members = this.allMembers
      console.log(this.allMembers)
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

  // get all the members that are not in the team already
  getAvailableMembers(members : []) {
    
    this.availMembers = this.allMembers.filter((m1 : any) => !members.some((m2 : any) => m1.ID === m2.ID))

    for (let i = 0; i < this.availMembers.length; i++)
      this.availMembers[i]['role'] = ''
    this.members = this.availMembers
    console.log(members)
    console.log(this.members)
  }


  // create new team
  createTeam(name : string) {
    let req = { 'teamName' : name }
    this.tmService.createTeam(localStorage.getItem('token'), req).subscribe((data) => {
      console.log(data);
      this.tid = data['teamID']
      console.log(this.tid)
      this.addMembersToTeam()
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
  // add team member
  addTeamMember(tID : string, uID: string, role : string) {
    let req = {"teamID" : tID, "userID" : uID, "userRole" : role};      

    this.tmService.addTeamMember(localStorage.getItem('token'), req).subscribe((data) => {
      console.log(data);
      this.getTeams()
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
    console.log(this.searchMem)
    if (!this.searchMem)
      this.allMembers = this.searchedMembers
    this.allMembers = this.searchedMembers.filter((x : any) =>
      x['name'].toLowerCase().includes(text.toLowerCase()) ||
      x['surname'].toLowerCase().includes(text.toLowerCase()) ||
      x['email'].toLowerCase().includes(text.toLowerCase())
    )
  }

  addMember(m : any) {
    console.log(m)
    let index = this.addMembers.findIndex(a => a['ID'] == m['ID'])
    if (index == -1)
      this.addMembers.push(m)
    else
      this.addMembers.splice(index, 1)
    console.log(this.addMembers)
  }

  addRole(m : any, role : string) {
    let index = this.addMembers.findIndex(a => a['ID'] == m['ID'])
    m['teamRole'] = role
    this.addMembers[index] = m
    console.log(this.addMembers)
  }

  typeRole(event) {
    this.role = event.target.value
    console.log(this.role)
  }

  addMembersToTeam() {
    this.addMembers.forEach((m : any) => {
      console.log(m)
      this.addTeamMember(this.tid, m.ID, m.teamRole)
    });
  }

  // remove team member
  removeTeamMember(teamID : string, userID : string) {
    // get user id
    let req = {"teamID": teamID, "userID": userID};
    this.tmService.removeTeamMember(localStorage.getItem('token'), req).subscribe((data) => {
      console.log(data);
      this.getTeams();
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
  // change role in team
  changeRole(form : NgForm) {
    //console.log(form);
    this.tmService.changeRole(localStorage.getItem('token'), form).subscribe((data) => {
      console.log(data);
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
  // edit team
  editTeam(id: string, name : string) {
    let req = {"teamID": id, "teamName": name};
    this.tmService.editTeam(localStorage.getItem('token'), req).subscribe((data) => {
      console.log(data);
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
  // delete team
  deleteTeam(id : string) {
    this.tmService.deleteTeam(localStorage.getItem('token'), id).subscribe((data) => {
      console.log(data);
      this.getTeams();
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


  /*** MODAL ***/
  closeResult: string;

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
