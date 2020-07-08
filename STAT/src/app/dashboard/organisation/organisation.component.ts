import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.sass']
})
export class OrganisationComponent implements OnInit {

  constructor() { }

  panelOpenState = false;

  ngOnInit(): void {
  }

}
