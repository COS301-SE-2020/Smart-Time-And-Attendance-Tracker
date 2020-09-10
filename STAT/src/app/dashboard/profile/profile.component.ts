import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')
    this.surname = localStorage.getItem('surname')
    this.roles = localStorage.getItem('roles')
    this.profilePic = ''
  }

  openFile() {
    document.querySelector('input').click()
  }

  handle(e){
    console.log('Change input file')
  }

}
