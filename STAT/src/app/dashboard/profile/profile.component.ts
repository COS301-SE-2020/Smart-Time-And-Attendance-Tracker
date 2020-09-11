import { Component, OnInit } from '@angular/core';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  name : string
  surname : string
  email : string
  roles : any 
  profilePic : string = '../../../assets/proPic1.jpg'
  cover : string = '../../../assets/STAT-logo.png'
  fileToUpload : File = null

  constructor(public service : AccountManagementService, public headerService : HeaderService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')
    this.surname = localStorage.getItem('surname')
    this.roles = localStorage.getItem('roles')
    this.profilePic = localStorage.getItem('profilePic')
  }

  openFile() {
    document.querySelector('input').click()
  }

  handle(file : any){
    this.fileToUpload = file.item(0)
    let location = "../../../assets/profilePictures/" + this.fileToUpload['name']
    let save = this.name + this.surname
    console.log(this.fileToUpload)
  }

  //add profile picture
  addPic(pic : String) {
    let req ={"profilePicture": pic}
    this.service.addProfilePic(localStorage.getItem('token'),req).subscribe((data) => {
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
}
