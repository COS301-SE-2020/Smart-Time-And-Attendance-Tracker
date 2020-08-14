import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HistoryService } from 'src/app/shared/services/history.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {
  displayedColumns = ['date', 'startTime', 'endTime', 'activeTime', 'description', 'project', 'task', 'value'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  roles : string;

  constructor(public headerService : HeaderService, public historyService : HistoryService) { }
  ngOnInit(): void {
    this.roles = localStorage.getItem('roles');

    if (this.roles == "Data Analyst")
      this.displayedColumns = ['date', 'startTime', 'endTime', 'activeTime', 'description', 'project', 'task', 'value', 'member'];
  }

  // get own time entries
  getOwn() {
    this.historyService.getOwnEntries(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  // get user time entries
  getUser(userID : string) {
    this.historyService.getUserEntries(localStorage.getItem('token'), userID).subscribe((data) => {
      console.log(data);
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  // get all user time entries
  getAllUser() {
    this.historyService.getAllUserEntries(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  // get all project time entries
  getAllProject(projectID : string) {
    this.historyService.getAllProjectEntries(localStorage.getItem('token'), projectID).subscribe((data) => {
      console.log(data);
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  // import time entry
  import(values : any) {
    this.historyService.import(localStorage.getItem('token'), values).subscribe((data) => {
      console.log(data);
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
}

export interface Element {
  date : string;
  startTime : string;
  endTime : string;
  activeTime : string;
  description : string;
  project : string;
  task : string;
  value: string;
  member : string;
}

const ELEMENT_DATA: Element[] = [
  {date : '10 Month', startTime : '00:00', endTime : '01:05', activeTime : '3h 42m', description : 'Firefox', project : 'Avengers Assemble', task : 'Look awesome', value : 'R 23.14', member : 'Sebastian Stan'},
  {date : '10 Month', startTime : '00:00', endTime : '19:33', activeTime : '1h 35m', description : 'Google Chrome', project : 'Capstone', task : 'History screen', value : 'R 0.00', member : 'Zac Efron'}
];
