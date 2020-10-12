import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HistoryService } from 'src/app/shared/services/history.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { ProjectManagementService } from 'src/app/shared/services/project-management.service';
import { Breakpoints } from '@angular/cdk/layout';
import { ValueTransformer } from '@angular/compiler/src/util';
import * as XLSX from 'xlsx';
import { element } from 'protractor';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { table } from 'console';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {
  allColumns = ['Date', 'Start Time', 'End Time', 'Active Time', 'Description', 'Project', 'Task', 'Monetary Value'];
  displayedColumns = ['Date', 'Start Time', 'End Time', 'Active Time', 'Description', 'Project', 'Task', 'Monetary Value']

  roles : string = localStorage.getItem('roles')

  allData : Object[] = []
  tableData : Object[] = []

  dateFrom : Date = null
  dateTo : Date = null

  projects : any[] = []
  pSelected : string = null
  members : any[] = []
  mSelected : string = null
  toggle : boolean = false
  sorted : string = 'newest'
  historyType : string

  imports : any[] = []

  constructor(public headerService : HeaderService, public historyService : HistoryService, public amService : AccountManagementService, public pmService : ProjectManagementService, private snackbar : MatSnackBar) { }
  ngOnInit(): void {

    if (this.roles.indexOf("Data Analyst") != -1)
      this.allColumns = ['Date', 'Start Time', 'End Time', 'Active Time', 'Description', 'Project', 'Task', 'Monetary Value', 'Member'];
      this.displayedColumns = this.allColumns
      
    if (this.roles.indexOf("Data Analyst") != -1) {
      this.historyType = 'da'
      this.getAllUser()
      this.getProjectsDA()
      this.getMembers()
    } else if (this.roles.indexOf("Team Leader") != -1) {
      this.historyType = 'tl'
      this.getOwn()
      this.getProjectsTL()
    } else {
      this.historyType = 'general'
      this.getOwn();
    }
  }

  // get own time entries
  getOwn() {
    this.tableData = []

    let req = {}
    if (this.dateFrom != null && this.dateTo != null)
      req = {'minDate' : this.dateFrom, 'maxDate' : this.dateTo}

    this.historyService.getOwnEntries(localStorage.getItem('token'), req).subscribe((data) => {
      //console.log(data);
      this.tableData = data['timeEntries']
      this.allData = this.tableData
      this.formatTableData()
    },
    error => {
      //console.log(error)
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  // get user time entries
  getUser(userID : string) {
    this.historyType = 'user'
    this.tableData = []
    let req
    if (this.dateFrom != null && this.dateTo != null)
      req = {'userID' : userID, 'minDate' : this.dateFrom, 'maxDate' : this.dateTo}
    else
      req = {'userID' : userID
    }
    this.historyService.getUserEntries(localStorage.getItem('token'), req).subscribe((data) => {
      //console.log(data);
      this.tableData = data['timeEntries']

      this.tableData.forEach((element : any) => {
        element.member = this.mSelected
      });

      this.allData = this.tableData
      this.formatTableData()
    },
    error => {
      //console.log(error)
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  // get all user time entries
  getAllUser() {
    this.historyType = 'da'
    this.tableData = []
    this.historyService.getAllUserEntries(localStorage.getItem('token')).subscribe((data) => {
      //console.log(data);
      let res : any[] = data['results']
      res.forEach((element : any) => {
        element.timeEntries.forEach((entry : any) => {
          if (entry.date != "Invalid Date") {
            entry.member = element.name + " " + element.surname
            this.tableData.push(entry)
          }
        });
      });
      this.allData = this.tableData
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
    this.historyType = 'project'
    this.tableData = []
    let req
    if (this.dateFrom != null && this.dateTo != null)
      req = {'projectID' : projectID, 'minDate' : this.dateFrom, 'maxDate' : this.dateTo}
    else
      req = {'projectID' : projectID
    }

    this.historyService.getAllProjectEntries(localStorage.getItem('token'), req).subscribe((data) => {
      //console.log(data);
      let res : any[] = data['results']['TeamMembers']
      //console.log(res)
      res.forEach((element : any) => {
        element.timeEntries.forEach((entry : any) => {
          entry.member = element.name + " " + element.surname
          entry.project = this.pSelected
          this.tableData.push(entry)
        });
      });
      this.allData = this.tableData
     //console.log(this.tableData)
      this.formatTableData()
    },
    error => {
      //console.log(error)
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  openJSON() {
    document.getElementById('json-input').click();
  }

  openCSV() {
    document.getElementById('csv-input').click();
  }

  readJSON(event) {
    var file = event.srcElement.files[0];
    var imports = []
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      let data
      reader.onload = function (evt : any) {
        data = JSON.parse(evt.target.result)
        //console.log(data)
        let values
        data.forEach((element : any) => {
          let start : any = new Date(element.date + " " + element.startTime)
          start = start.getTime()
          let end : any = new Date(element.date + " " + element.endTime)
          end = end.getTime()

          values = { 'userID' : element.userID, 'date' : element.date, 'startTime' : start, 
                    'endTime' : end, 'description' : element.description, 'device' : element.device}

          if (element.taskID)
            values = Object.assign(values, { 'taskID' : element.taskID, 'taskName' : element.taskName})
          if (element.projectID)
            values = Object.assign(values, { 'projectID' : element.projectID, 'projectName' : element.projectName})
          if (element.activeTime)
            values = Object.assign(values, { 'activeTime' : element.activeTime})
          if (element.monetaryValue)
            values = Object.assign(values, { 'monetaryValue' : element.monetaryValue})

          imports.push(values)
        });
      }
      reader.onerror = (evt) => {
        //console.log('error reading file');
        this.snackbar.open("Incorrect JSON file format", "Dismiss", {
          duration: 5000,
        });
      }
    }
    
    reader.onloadend = () => {
      imports.forEach(element => {
        this.import(element)
      });

      this.snackbar.open("JSON file imported successfully", "Dismiss", {
        duration: 5000,
      });
    }
  }

  readCSV(event) {
    const target: DataTransfer = <DataTransfer>(event.target);
    let data
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      //console.log(data); // Data will be logged in array format containing objects
    };

    reader.onerror = (evt) => {
      //console.log('error reading file');
      this.snackbar.open("Incorrect Excel file format", "Dismiss", {
        duration: 5000,
      });
    }

    reader.onloadend = () => {
      data.forEach(element => {
        //console.log(element)
        let date = new Date(Math.round((element.date - 25569)*86400*1000))
        let sDate = date.getFullYear() + "/"
        if (date.getMonth() + 1 < 10)
          sDate += "0" + (date.getMonth()+1) + "/"
        else
          sDate += (date.getMonth()+1) + "/"

        if (date.getDate() < 10)
          sDate += "0" + date.getDate()
        else
          sDate += date.getDate()

        //console.log(sDate)
        element.date = sDate
        let start = new Date(sDate + " " + this.formatCSVTime(element.startTime))
        element.startTime = start.getTime()
        let end = new Date(sDate + " " + this.formatCSVTime(element.endTime))
        element.endTime = end.getTime()
        //console.log(element)

        this.import(element)
      });
      
      this.snackbar.open("Excel file imported successfully", "Dismiss", {
        duration: 5000,
      });

    }
  }

  formatCSVTime(time) {
    var result
    var hours = parseInt(time.substr(0, 2));
    if(time.indexOf('am') != -1 && hours == 12) {
      result = time.replace('12', '0');
    }
    if(time.indexOf('pm')  != -1 && hours < 12) {
        result = time.replace(hours, (hours + 12));
    }
    result = result.replace(/(am|pm)/, '');
    return result
  }

  // import time entry
  import(values : any) {
    this.historyService.import(localStorage.getItem('token'), values).subscribe((data) => {
      //console.log(data);
    },
    error => {
      //console.log(error)
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  getProjectsTL() {
    this.amService.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      //console.log(data);
      this.projects = data['projects']
      this.members = []
      this.projects.forEach((element : any) => {
        element.projectMembers.forEach((m : any) => {
          if (this.members.findIndex((a : any) => a.ID === m.ID) == -1)
            this.members.push(m)
        });
      });
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  getProjectsDA() {
    this.pmService.getProjects(localStorage.getItem('token')).subscribe((data) => {
      //console.log(data);
      this.projects = data['projects']
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  getMembers() {
    this.amService.getAllUsers(localStorage.getItem('token')).subscribe((data) => {
      //console.log(data)
      this.members = data['users']
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
    //console.log(this.tableData)

    this.tableData.forEach((element : any) => {
      element.startTime = this.formatTime(element.startTime)
      element.endTime = this.formatTime(element.endTime)
      element.month = this.getMonth(element.date)
      element.fDate = this.formatDate(element.date)
    });

    let temp = []
    this.tableData.forEach((element : any) => {
      if (!isNaN(element.date.getTime()))
        temp.push(element)
    });

    temp.sort((a : any ,b : any) =>
      a.date - b.date || a.timeEntryID.localeCompare(b.timeEntryID)
    );
    this.tableData = temp.reverse()

    this.groupAndSort(this.tableData)

  }

  // group and sort entries
  groupAndSort(data : any[]) {
    // group by month
    let grouped = data.reduce((r : any, e : any) => {
      // get month and year of current element
      let month = e.month;

      // if there is no property in accumulator with this month create it
      if (!r[month]) r[month] = { month, records: [e] }

      // if there is push current element to children array for that month
      else r[month].records.push(e);

      // return accumulator
      return r;
    }, {});

    this.tableData = Object.values(grouped)
    //console.log(this.tableData)
  }

  filterDateRange() {

    //console.log(this.dateTo)
    //console.log(this.dateFrom)

    this.tableData = []

    //console.log(this.allData)

    if (this.dateFrom == null) {  
      this.allData.forEach((entry : any) => {
        if (entry.date <= new Date(this.dateTo))
          this.tableData.push(entry)
      })
    } else if (this.dateTo == null) {
      this.allData.forEach((entry : any) => {
        if (entry.date >= new Date(this.dateFrom))
          this.tableData.push(entry)
      })
    } else {
      this.allData.forEach((entry : any) => {
        if (entry.date >= new Date(this.dateFrom) && entry.date <= new Date(this.dateTo))
          this.tableData.push(entry)
      })
    }

    this.formatTableData()
  }

  getHistory() {
    switch (this.historyType) {
      case 'general':
        this.getOwn()
        break
      case 'da':
        this.getAllUser()
        break
      case 'tl':
        this.getOwn()
        break
      case 'user':
        this.getUser(this.mSelected)
        break
      case 'project':
        this.getAllProject(this.pSelected)
    }
  }

  sort(type : string) {
    if (type == 'o' && this.sorted == 'newest') {
      this.sorted = 'oldest'
      this.tableData = this.tableData.reverse()
    } else if (type == 'n' && this.sorted == 'oldest') {
      this.sorted = 'newest'
      this.tableData = this.tableData.reverse()
    }
    //console.log(this.tableData)
  }

  exportToJSON() {
    let dataStr = JSON.stringify(this.tableData, null, 4);
    var x = window.open();
    x.document.open();
    x.document.write('<html><body><pre>' + dataStr + '</pre></body></html>');
    x.document.close();
  }

  downloadJSON() {
    let dataStr = JSON.stringify(this.tableData, null, 4);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'TrackingEntries.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  exportPDF() {
    
    var doc = new jsPDF("l");
    var cols = ["Date", "Start time", "End time", "Active time", "Project", "Task", "Monetary Value", "Member"]
    var rows = [];

    this.tableData.forEach((element : any) => {
      element.records.forEach((record : any) => {
        var temp = [record.fDate, record.startTime, record.endTime, record.activeTime, record.project,
                    record.task, record.monetaryValue, record.member]
        rows.push(temp)
      })
    })

    autoTable(doc, {head : [cols], body : rows})

    doc.output('dataurlnewwindow');
    //doc.save('Test.pdf');
  }

  downloadPDF() {
    var doc = new jsPDF("l");
    var cols = ["Date", "Start time", "End time", "Active time", "Project", "Task", "Monetary Value", "Member"]
    var rows = [];

    this.tableData.forEach((element : any) => {
      element.records.forEach((record : any) => {
        var temp = [record.fDate, record.startTime, record.endTime, record.activeTime, record.project,
                    record.task, record.monetaryValue, record.member]
        rows.push(temp)
      })
    })

    autoTable(doc, {head : [cols], body : rows})

    doc.save('TrackingEntries.pdf');
  }

  downloadCSV() {
    const { Parser, transforms: { unwind } } = require('json2csv');

    const fields = [
      { label : 'Month', value : 'records.month'}, 
      { label : 'Date', value : 'records.date'}, 
      { label : 'Start Time', value : 'records.startTime'}, 
      { label : 'End Time', value : 'records.endTime'}, 
      { label : 'Active Time', value : 'records.activeTime'}, 
      { label : 'Project', value : 'records.project'}, 
      { label : 'Task', value : 'records.task'}, 
      { label : 'Monetary Value', value : 'records.monetaryValue'}, 
      { label : 'Member', value : 'records.member'}
    ];
    const transforms = [unwind({ paths: ['records'] })];
    
    const json2csvParser = new Parser({ fields, transforms });
    const csv = json2csvParser.parse(this.tableData);

    let dataUri = 'data:text/csv;charset=utf-8,'+ csv;

    let exportFileDefaultName = 'TrackingEntries.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  exportCSV() {
    const { Parser, transforms: { unwind } } = require('json2csv');

    const fields = [
      { label : 'Month', value : 'records.month'}, 
      { label : 'Date', value : 'records.date'}, 
      { label : 'Start Time', value : 'records.startTime'}, 
      { label : 'End Time', value : 'records.endTime'}, 
      { label : 'Active Time', value : 'records.activeTime'}, 
      { label : 'Project', value : 'records.project'}, 
      { label : 'Task', value : 'records.task'}, 
      { label : 'Monetary Value', value : 'records.monetaryValue'}, 
      { label : 'Member', value : 'records.member'}
    ];
    const transforms = [unwind({ paths: ['records'] })];
    
    const json2csvParser = new Parser({ fields, transforms });
    const csv = json2csvParser.parse(this.tableData);

    let dataUri = 'data:text/csv;charset=utf-8,'+ csv;

    let exportFileDefaultName = 'TrackingEntries.csv';
    

    var x = window.open();
    x.document.open();
    x.document.write('<html><body><pre>' + csv + '</pre></body></html>');
    x.document.close();
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

