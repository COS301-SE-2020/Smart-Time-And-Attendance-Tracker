import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(public router : Router) { }

  ngOnInit(): void {
    //if (localStorage.getItem('loggedIn') == 'true')
    //  this.router.navigate(['main']);
  }

}
