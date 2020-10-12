import { Component, OnInit } from '@angular/core';

import { HeaderService } from 'src/app/shared/services/header.service';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { IotManagementService } from 'src/app/shared/services/iot-management.service';
import { AttendanceService } from 'src/app/shared/services/attendance.service';

import { element } from 'protractor';
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.sass']
})
export class AttendanceComponent implements OnInit {
  allColumns = ['Date', 'Start Time', 'End Time', 'Device'];
  displayedColumns = ['Date', 'Start Time', 'End Time', 'Device']

  roles: string = localStorage.getItem('roles')

  allData: Object[] = []
  tableData: Object[] = []

  dateFrom: Date = null
  dateTo: Date = null

  devices: any[] = []
  dSelected : string = null
  members: any[] = []
  mSelected: string = null
  toggle : boolean = false
  sorted : string = 'newest'

  attendanceType : string

  constructor(public headerService: HeaderService, public amService: AccountManagementService, public imService: IotManagementService, public attendanceService: AttendanceService) { }

  ngOnInit(): void {
    if (this.roles.indexOf("Data Analyst") != -1) {
      this.allColumns = ['Date', 'Start Time', 'End Time', 'Device', 'Name'];
      this.displayedColumns = this.allColumns

      // set up table
      this.attendanceType = 'da'
      this.getAllUsersAttendanceEntries()
      this.getMembers()
    }
    else {
      this.attendanceType = 'general'
      this.getOwnAttendanceEntries()
    }
  }

  // users and devices

  getMembers() {
    this.amService.getAllUsers(localStorage.getItem('token')).subscribe((data) => {
      this.members = data['users']
    },
      error => {
        let errorCode = error['status'];
        if (errorCode == '403') {
          this.headerService.kickOut();
        }
      });
  }

  // get entries

  getAttendance() {
    switch (this.attendanceType) {
      case 'general':
        this.getOwnAttendanceEntries()
        break
      case 'da':
        this.getAllUsersAttendanceEntries()
        break
      case 'user':
        let id = this.members[this.mSelected].ID
        this.getUserAttendanceEntries(id)
        break
    }
  }

  getAllUsersAttendanceEntries() {
    this.attendanceType = 'da'
    this.tableData = []
    
    this.attendanceService.getAllUsersAttendanceEntries(localStorage.getItem('token')).subscribe((data) => {
      let res: any[] = data['results']
      res.forEach((element: any) => {
        element.attendanceEntries.forEach((entry: any) => {
          entry.name = element.name + " " + element.surname
          entry.email = element.email
          this.tableData.push(entry)
        });
      });
      this.allData = this.tableData
      this.formatTableData()
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403') {
        this.headerService.kickOut();
      }
    });
  }

  getOwnAttendanceEntries() {
    this.attendanceType = 'general'
    this.tableData = []

    let req = {}
    if (this.dateFrom != null && this.dateTo != null)
      req = { 'minDate': this.dateFrom, 'maxDate': this.dateTo }
      //console.log(this.dateFrom)

    this.attendanceService.getOwnAttendanceEntries(localStorage.getItem('token'), req).subscribe((data) => {
      this.tableData = data['attendanceEntries']
      this.allData = this.tableData
      this.formatTableData()
    },
    error => {
      //console.log(error)
      let errorCode = error['status'];
      if (errorCode == '403') {
        this.headerService.kickOut();
      }
    });
  }

  getUserAttendanceEntries(userID : string) {
    this.attendanceType = 'user'

    this.tableData = []
    let req
    if (this.dateFrom != null && this.dateTo != null)
      req = { 'userID': userID, 'minDate': this.dateFrom, 'maxDate': this.dateTo }
    else
      req = { 'userID': userID }
    this.attendanceService.getUserAttendanceEntries(localStorage.getItem('token'), req).subscribe((data) => {
      //console.log(data);
      this.tableData = data['attendanceEntries']

      //console.log(this.tableData);
      this.tableData.forEach((element: any) => {
        element.name = this.members[this.mSelected].name + " " + this.members[this.mSelected].surname
      });

      this.allData = this.tableData
      this.formatTableData()
    },
      error => {
        //console.log(error)
        let errorCode = error['status'];
        if (errorCode == '403') {
          this.headerService.kickOut();
        }
      });
  }

  // format and sort

  formatTableData() {
    this.tableData.forEach((element: any) => {
      element.date = this.sameFormat(element.date)
    });

    this.tableData.sort((a: any, b: any) =>
      a.date - b.date || a.attendanceEntryID.localeCompare(b.attendanceEntryID)
    );
    this.tableData = this.tableData.reverse()
    //console.log(this.tableData)

    this.tableData.forEach((element: any) => {
      element.startTime = this.formatTime(element.startTime)
      element.endTime = this.formatTime(element.endTime)
      element.month = this.getMonth(element.date)
      element.fDate = this.formatDate(element.date)
    });

    this.groupAndSort(this.tableData)
  }

  groupAndSort(data: any[]) {
    // group by month
    let grouped = data.reduce((r: any, e: any) => {
      let month = e.month;

      if (!r[month])
        r[month] = { month, records: [e] }
      else
        r[month].records.push(e);

      return r;
    }, {});

    this.tableData = Object.values(grouped)
  }

  filterDateRange() {
    this.tableData = []

    if (this.dateFrom == null) {
      this.allData.forEach((entry: any) => {
        if (entry.date <= new Date(this.dateTo))
          this.tableData.push(entry)
      })
    } else if (this.dateTo == null) {
      this.allData.forEach((entry: any) => {
        if (entry.date >= new Date(this.dateFrom))
          this.tableData.push(entry)
      })
    } else {
      this.allData.forEach((entry: any) => {
        if (entry.date >= new Date(this.dateFrom) && entry.date <= new Date(this.dateTo))
          this.tableData.push(entry)
      })
    }

    this.formatTableData()
  }

  formatTime(d: Date) {
    d = new Date(d)
    let hours = d.getHours().toString()
    let mins = d.getMinutes().toString()

    if (hours.length < 2)
      hours = "0" + hours

    if (mins.length < 2)
      mins = "0" + mins

    return hours + ":" + mins
  }

  getMonth(d: Date) {
    const options = {
      year: "numeric",
      month: "long"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

  formatDate(d: Date) {
    const options = {
      month: "short",
      day: "2-digit"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

  sameFormat(d: Date) {
    return new Date(d)
  }

  sort(type: string) {
    if (type == 'o' && this.sorted == 'newest') {
      this.sorted = 'oldest'
      this.tableData = this.tableData.reverse()
    } else if (type == 'n' && this.sorted == 'oldest') {
      this.sorted = 'newest'
      this.tableData = this.tableData.reverse()
    }
  }

  // export and download

  exportToJSON() {
    let dataStr = JSON.stringify(this.tableData, null, 4);
    var x = window.open();
    x.document.open();
    x.document.write('<html><body><pre>' + dataStr + '</pre></body></html>');
    x.document.close();
  }

  downloadJSON() {
    let dataStr = JSON.stringify(this.tableData, null, 4);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'TrackingEntries.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  exportPDF() {

    var doc = new jsPDF("l");
    var cols = ["Date", "Start time", "End time", "Device", "Name"]
    var rows = [];

    this.tableData.forEach((element: any) => {
      element.records.forEach((record: any) => {
        var temp = [record.fDate, record.startTime, record.endTime, record.device, record.name]
        rows.push(temp)
      })
    })

    autoTable(doc, { head: [cols], body: rows })

    doc.output('dataurlnewwindow');
    //doc.save('Test.pdf');
  }

  downloadPDF() {
    var doc = new jsPDF("l");
    var cols = ["Date", "Start time", "End time", "Device", "Name"]
    var rows = [];

    this.tableData.forEach((element: any) => {
      element.records.forEach((record: any) => {
        var temp = [record.fDate, record.startTime, record.endTime, record.device, record.name]
        rows.push(temp)
      })
    })

    autoTable(doc, { head: [cols], body: rows })

    doc.save('TrackingEntries.pdf');
  }

  downloadCSV() {
    const { Parser, transforms: { unwind } } = require('json2csv');

    const fields = [
      { label: 'Month', value: 'records.month' },
      { label: 'Date', value: 'records.date' },
      { label: 'Start Time', value: 'records.startTime' },
      { label: 'End Time', value: 'records.endTime' },
      { label: 'Device', value: 'records.device' },
      { label: 'Name', value: 'records.name' }
    ];

    const transforms = [unwind({ paths: ['records'] })];
    const json2csvParser = new Parser({ fields, transforms });
    const csv = json2csvParser.parse(this.tableData);

    let dataUri = 'data:text/csv;charset=utf-8,' + csv;
    let exportFileDefaultName = 'TrackingEntries.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  exportCSV() {
    const { Parser, transforms: { unwind } } = require('json2csv');

    const fields = [
      { label: 'Month', value: 'records.month' },
      { label: 'Date', value: 'records.date' },
      { label: 'Start Time', value: 'records.startTime' },
      { label: 'End Time', value: 'records.endTime' },
      { label: 'Device', value: 'records.device' },
      { label: 'Name', value: 'records.name' }
    ];

    const transforms = [unwind({ paths: ['records'] })];
    const json2csvParser = new Parser({ fields, transforms });
    const csv = json2csvParser.parse(this.tableData);

    let dataUri = 'data:text/csv;charset=utf-8,' + csv;
    let exportFileDefaultName = 'TrackingEntries.csv';

    var x = window.open();
    x.document.open();
    x.document.write('<html><body><pre>' + csv + '</pre></body></html>');
    x.document.close();
  }
}

export interface Element {
  date: string;
  startTime: string;
  endTime: string;
  device: string;
  name: string;
  email: string;
}