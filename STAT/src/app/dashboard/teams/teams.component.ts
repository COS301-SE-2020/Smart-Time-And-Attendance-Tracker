import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TeamManagementService } from 'src/app/shared/services/team-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.sass']
})
export class TeamsComponent implements OnInit {

  constructor(private modalService: NgbModal, public headerService : HeaderService, public tmService: TeamManagementService) { }

  panelOpenState = false;
  roles : string

  addTeamForm : FormGroup
  addMemberForm : FormGroup
  teams : Object[]
  tid : string
  teamName : string
  members : Object[]
  mid : string
  memberName : string

  error : string

  ngOnInit(): void {
    // page setup
    this.roles = localStorage.getItem('roles');
    // add team form
    this.addTeamForm = new FormGroup({
      teamName : new FormControl('', [Validators.required])
    });
    // add member form
    this.addMemberForm = new FormGroup({
      userID : new FormControl(''), // ??
      projectID : new FormControl('')
    });

    this.getTeams();
  }

  /*** API CALLS ***/

  // get all teams
  getTeams() {
    this.tmService.getTeams(localStorage.getItem('token')).subscribe((data) => {
      this.teams = data['teams']
      console.log(data);
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
  // get team members
  getMembers() {
    this.members == []

    for (let x = 0; x = this.teams.length; x++) {
      var temp : Object[] = this.teams['members']

      if (temp.length != 0) {
        for (let y = 0; y < temp.length; y++) {
          // need to know get teams response structure
        }
      }
    }
  }
  // create new team
  createTeam(form : NgForm) {
    console.log(form);
    this.tmService.createTeam(localStorage.getItem('token'), form).subscribe((data) => {
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
  // add team member
  addTeamMember(form : NgForm) {
    console.log(form);
    this.tmService.addTeamMember(localStorage.getItem('token'), form).subscribe((data) => {
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
  // remove team member
  removeTeamMember(form : NgForm) {
    // get user id
    this.tmService.removeTeamMember(localStorage.getItem('token'), form).subscribe((data) => {
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
  // change role in team
  changeRole(form : NgForm) {
    console.log(form);
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
