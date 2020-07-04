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

  // active tab
  active : string;

  constructor(public service : AccountManagementService) { }

  ngOnInit(): void {
    const hamburger = document.getElementById('hamburger');
    const wrapper = document.getElementById('wrapper');
    
    hamburger.addEventListener('click', () => {
      wrapper.classList.toggle('open')
    })

    this.active = 'today';
  }

  // set active tab after component initialisation
  ngAfterViewInit(): void {
    const navItem = document.getElementById('today');
    navItem.classList.add('active');
  }

  // set new active tab after click
  setActive(tabName : string) {
    const currActive = document.getElementsByClassName('active')[0];
    currActive.classList.remove('active');
    const link = document.getElementById(tabName);
    link.classList.add('active');
    this.active = tabName;
  }

}
