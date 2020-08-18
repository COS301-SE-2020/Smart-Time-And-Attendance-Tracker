import { Component, OnInit } from '@angular/core';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  projects: any = [
    {value: '0', name: 'Project 0'},
    {value: '1', name: 'Project 1'},
    {value: '2', name: 'Project 2'}
  ];

  admin : boolean;
  dataAnalyst : boolean;
  general : boolean;

  constructor(public service : AccountManagementService) { }

  ngOnInit(): void {
    const hamburger = document.getElementById('hamburger');
    const wrapper = document.getElementById('wrapper');
    
    hamburger.addEventListener('click', () => {
      wrapper.classList.toggle('open')
    })

    this.dataAnalyst = false;
  }

  // set active tab after component initialisation
  ngAfterViewInit(): void {
    const navItem = document.getElementById('default');
    navItem.classList.add('active');
  }

  // set new active tab after click
  setActive(id: number) {
    const currActive = document.getElementsByClassName('active')[0];
    console.log(currActive);
    currActive.classList.remove('active');
    const navItem = document.getElementsByTagName('li')[id+1];
    const link = navItem.getElementsByTagName('a')[0];
    link.classList.add('active');
  }

}
