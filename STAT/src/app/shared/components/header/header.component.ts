import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  // know which header to display
  isLoggedIn: string;

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('loggedIn');
  }
}
