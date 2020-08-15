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
  allColumns = ['Date', 'Start Time', 'End Time', 'Active Time', 'Description', 'Project', 'Task', 'Monetary Value'];
  displayedColumns = ['Date', 'Start Time', 'End Time', 'Active Time', 'Description', 'Project', 'Task', 'Monetary Value']

  roles : string;

  tableData : any[] = []

  constructor(public headerService : HeaderService, public historyService : HistoryService) { }
  ngOnInit(): void {
    this.roles = localStorage.getItem('roles');

    if (this.roles.indexOf("Data Analyst") != -1)
      this.allColumns = ['Date', 'Start Time', 'End Time', 'Active Time', 'Description', 'Project', 'Task', 'Monetary Value', 'Member'];
      this.displayedColumns = this.allColumns

    // if general user
    if (this.roles.indexOf("General Team Member") != -1)
      this.getOwn();
    else
      this.getAllUser();
  }

  // get own time entries
  getOwn() {
    this.historyService.getOwnEntries(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      this.tableData = data['timeEntries']
      this.formatTableData()
    },
    error => {
      console.log(error)
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
      let res : any[] = data['results']
      res.forEach((element : any) => {
        element.timeEntries.forEach((entry : any) => {
          entry.member = element.name + " " + element.surname
          this.tableData.push(entry)
        });
      });
      this.formatTableData()
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

  // get correct time format
  formatTime(d : Date) {
    d = new Date(d)
    let hours = d.getHours().toString()
    let mins = d.getMinutes().toString()

    if (hours.length < 2)
      hours = "0" + hours

    if (mins.length < 2)
      mins = "0" + mins

    return hours + ":" + mins
  }

  getMonth(d : Date) {
    const options = {
      year: "numeric",
      month:"long"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

  formatDate(d : Date) {
    const options = {
      month:"short",
      day:"2-digit"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

  sameFormat(d : Date) {
    return new Date(d)
  }

  formatTableData() {
    this.tableData.forEach((element : any) => {
      element.date = this.sameFormat(element.date)
    });

    this.tableData.sort((a : any ,b : any) =>
      a.date - b.date || a.timeEntryID.localeCompare(b.timeEntryID)
    );
    this.tableData = this.tableData.reverse()
    console.log(this.tableData)

    this.tableData.forEach((element : any) => {
      element.startTime = this.formatTime(element.startTime)
      element.endTime = this.formatTime(element.endTime)
      element.month = this.getMonth(element.date)
      element.fDate = this.formatDate(element.date)
    });
    this.groupAndSort(this.tableData)
  }

  // group and sort members
  groupAndSort(data : any[]) {
    // group by month
    let grouped = data.reduce((r : any, e : any) => {
      // get first letter of name of current element
      let month = e.month;

      // if there is no property in accumulator with this letter create it
      if (!r[month]) r[month] = { month, records: [e] }

      // if there is push current element to children array for that letter
      else r[month].records.push(e);

      // return accumulator
      return r;
    }, {});

    this.tableData = Object.values(grouped)
    console.log(this.tableData)
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

