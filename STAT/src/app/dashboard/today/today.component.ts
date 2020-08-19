import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.sass']
})
export class TodayComponent implements OnInit {

  constructor(private modalService: NgbModal, public headerService : HeaderService, public service : TrackingService, public amService : AccountManagementService, public sanitizer: DomSanitizer) { }

  stop =false;
  currentTime : number;
  startTime : number;
  timing :number;
  hours: number;
  count;
  sync;
  projectName: string;
  projectID : string;
  
  panelOpenState = false;
  closeResult: string;
  autoTracking = true;
  manualTrackingForm : FormGroup
  automaticTrackingForm: FormGroup

  projects : []
  tasks : { ID : any, taskName : string }[]
  mProjectSelected : any
  aProjectSelected : any
  mTaskSelected : any
  aTaskSelected : any
  aTasksDisabled : boolean = true
  mTasksDisabled : boolean = true
  hourlyRate : number
  monetaryValue : number
  activeTime : number

  pName : string
  tName : string

  entries : Object[]
  week : Object[] = []
  date : Date = new Date()
  date1 : Date = new Date()
  date2 : Date = new Date()
  date3 : Date = new Date()
  date4 : Date = new Date()
  date5 : Date = new Date()

  currentlyTracking = { 'device' : 'device', 'description' : '', 'date' : '', 'startTime' : '', 
                                  'activeTime' : 0, 'projectName' : '', 'taskName' : ''}

  @ViewChild('iframe') iframe: ElementRef;

  ngOnInit(): void {
    this.manualTrackingForm = new FormGroup({
      description : new FormControl(''),
      project : new FormControl(''),
      taskID : new FormControl(''),
      //MonetaryValue : new FormControl('', [Validators.required]),
      date : new FormControl('', [Validators.required]),
      startTime : new FormControl('', [Validators.required]),
      endTime : new FormControl('', [Validators.required]),
      projectName : new FormControl(''),
      taskName : new FormControl(''),
      activeTime : new FormControl('')
    });

    this.manualTrackingForm.setValidators(this.checkTimes('StartTime', 'EndTime'));

    this.automaticTrackingForm = new FormGroup({
      description : new FormControl(''),
      projectID : new FormControl(''),
      taskID : new FormControl(''),
      projectName : new FormControl(''),
      taskName : new FormControl('')
    });

    this.tasks = [ { "ID" : 0, "taskName" : "None" }];

    // set dates
    this.date1.setDate(this.date.getDate()-1)
    this.date2.setDate(this.date.getDate()-2)
    this.date3.setDate(this.date.getDate()-3)
    this.date4.setDate(this.date.getDate()-4)
    this.date5.setDate(this.date.getDate()-5)

    this.reload()

  }

  // reload page data
  reload() {
    this.getProAndTasks()

    // get entries
    this.getEntries(this.formatDate(this.date))
    this.getEntries(this.formatDate(this.date1))
    this.getEntries(this.formatDate(this.date2))
    this.getEntries(this.formatDate(this.date3))
    this.getEntries(this.formatDate(this.date4))
    this.getEntries(this.formatDate(this.date5))
  }

  // modal
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  modalForm() {
    this.autoTracking = !this.autoTracking
  }

  //Add a manual time entry from form
  addManualEntry(form : NgForm)
  {
    this.service.addMTimeEntry(form, localStorage.getItem('token')).subscribe((data) => {
      this.reload()
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  // calculate monetary value for manual entry
  calculateMoney() {
    var startTime = this.manualTrackingForm.get('startTime').value
    var endTime = this.manualTrackingForm.get('endTime').value
    if (startTime && endTime) {
      startTime = new Date('2020/01/01 ' + startTime)
      endTime = new Date('2020/01/01 ' + endTime)
      var diff = endTime.getTime() - startTime.getTime()
      this.activeTime = Math.floor( diff / 60000);
      var hours = diff / 3600000
      this.monetaryValue = hours * this.hourlyRate
      this.manualTrackingForm.get('monetaryValue').setValue(this.monetaryValue)
    }

    if (isNaN(this.monetaryValue))
      this.monetaryValue = 0

  }

  //Add an automatic time entry from form
  addAutomaticEntry(form : NgForm)
  {
    this.stop = false;
    let now = new Date();
    this.startTime = now.getTime();
    form['startTime']= this.startTime;
    this.currentlyTracking.startTime = new Date(this.startTime).toLocaleString('en-GB', { hour:'numeric', minute:'numeric', hour12:false } );
    setTimeout (() => {
      if(this.stop == false)
      {
        now = new Date();
        form['endTime']=  now.getTime();

        this.timing = 1;
        form['activeTime'] = 1;
        form['date']= formatDate(now, 'yyyy/MM/dd', 'en-US');

        this.service.addATimeEntry(form, localStorage.getItem('token')).subscribe((data) => {
          this.service.EntryID = data['timeEntryID'];
          localStorage.setItem('currentlyTracking', data['timeEntryID']);

          var details = {'projectName': form['projectName'], 'projectID': form['projectID'],'taskID': form['taskID'],'taskName':  form['taskName'] };
          this.currentlyTracking.projectName = form['projectName']
          this.currentlyTracking.taskName = form['taskName']
          this.currentlyTracking.description = form['description']

          const options = {
            year: "numeric",
            month:"short",
            day:"2-digit"
          }
          this.currentlyTracking.date = new Date().toLocaleDateString('en-US', options)
  
          localStorage.setItem('currentlyTrackingDetails',JSON.stringify( details));

          this.tracking();
          },
          error => {
            console.log(error);
            let errorCode = error['status'];
            if (errorCode == '403')
              this.headerService.kickOut();

          });
   }this.stop = false;
  }, 60000);
      
  }

  stopTracking()
  {
    console.log("Stop");
    this.stop = true;
    if(localStorage.getItem('currentlyTracking') == this.service.EntryID)
    {
      localStorage.removeItem('currentlyTracking');
      localStorage.removeItem('currentlyTrackingDetails');
      this.updateEntry();
    }
     

  }
  tracking()
  {
    //console.log(this.service.getSharedLocalStorage(this.iframe.nativeElement, "token"));

    console.log("tracking");
    this.count = timer(60000);
    this.count.subscribe(x => {
      if(localStorage.getItem('currentlyTracking') == this.service.EntryID)
      { 
        this.timing = this.timing +1;
         ////////////////////////////////////////////display new time
        this.currentlyTracking.activeTime = this.timing
        console.log(this.currentlyTracking)
        console.log(this.timing);
        this.tracking();
      }
    });
    this.sync = timer(600000);
    this.sync.subscribe(x => {
      if(localStorage.getItem('currentlyTracking') == this.service.EntryID)
      { 
        this.updateEntry().subscribe((data) => {
        },
        error => {
          let errorCode = error['status'];
          if (errorCode == '403')
            this.headerService.kickOut();
    
        });
      }
      else
        this.stopTracking();
    });

  }

  //Update a time entry. Parameters are the new end time and active time
  updateEntry()
  {
    console.log("update");
    var endTime = new Date().getTime();
    var activeTime = this.timing;
    this.hours =  activeTime / 60;
    if(this.hourlyRate == undefined)
      this.monetaryValue = 0
    else
      this.monetaryValue = this.hours * this.hourlyRate
 
    if (isNaN(this.monetaryValue))
    {
      this.monetaryValue = 0
    }
    let values = {"timeEntryID" : this.service.EntryID, "endTime": endTime, "activeTime" : activeTime," monetaryValue" : this.monetaryValue};
     return this.service.updateTimeEntry(values, localStorage.getItem('token'));

  }

  // edit tracking entry
  editEntry(form : NgForm) {

  }

  // get projects and tasks
  getProAndTasks()
  {
    this.service.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      this.projects = data['projects']
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  // get tasks
  getTasks(projectID : any, form : string) {
    if (form == 'a') {
      if (this.aProjectSelected == null)
        this.tasks = [ { "ID" : 0, "taskName" : "None" }];
    
      else {
        this.aTasksDisabled = false;
        this.tasks = this.projects.find((p : any) => p.ID == projectID)['tasks'];
        this.hourlyRate = this.projects.find((p : any) => p.ID == projectID)['hourlyRate']
      }
    } else {
      if (this.mProjectSelected == null)
        this.tasks = [ { "ID" : 0, "taskName" : "None" }];
      else {
        this.mTasksDisabled = false;
        this.tasks = this.projects.find((p : any) => p.ID == projectID)['tasks'];
        this.hourlyRate = this.projects.find((p : any) => p.ID == projectID)['hourlyRate']
      }
    }

    return this.tasks;
  }

  // get tracking entries
  getEntries(date : String) {
    this.amService.getTimeEntries(date, localStorage.getItem('token')).subscribe((data) => {
      console.log(data)
      if (date == this.formatDate(this.date))
        this.week['today'] = data['timeEntries']
      if (date == this.formatDate(this.date1))
        this.week['yesterday'] = data['timeEntries']
      if (date == this.formatDate(this.date2))
        this.week['2days'] = data['timeEntries']
      if (date == this.formatDate(this.date3))
        this.week['3days'] = data['timeEntries']
      if (date == this.formatDate(this.date4))
        this.week['4days'] = data['timeEntries']
      if (date == this.formatDate(this.date5))
        this.week['5days'] = data['timeEntries']
    },
    error => {
      //console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }

      // should this still happen if error 403 ?????????????????????????????????????????????????
      if (date == this.formatDate(this.date))
        this.week['today'] = 'no entries'
      if (date == this.formatDate(this.date1))
        this.week['yesterday'] = 'no entries'
      if (date == this.formatDate(this.date2))
        this.week['2days'] = 'no entries'
      if (date == this.formatDate(this.date3))
        this.week['3days'] = 'no entries'
      if (date == this.formatDate(this.date4))
        this.week['4days'] = 'no entries'
      if (date == this.formatDate(this.date5))
        this.week['5days'] = 'no entries'
    });
  }

  getWeek(date : String) {
    console.log(this.getEntries(date))
  }

  // get time spent
  getTime(mins : number) {
    var hours = Math.floor(mins / 60)
    var rem = mins % 60
    return (hours + 'h ' + rem + 'm')
  }

  // format date
  formatDate(date : Date) {
    var y = date.getFullYear().toString();
    var m = (date.getMonth()+1).toString();
    var d = date.getDate().toString();

    let toReturn = new String(y + '/');

    if (m.length == 1)
      toReturn += ('0' + m + '/')
    else
      toReturn += (m + '/')

    if (d.length == 1)
      toReturn += ('0' + d)
    else
      toReturn += (d)

    return toReturn
  }

  // get correct date format
  formatWeekDate(d : Date) {
    const options = {
      month:"long",
      day:"2-digit"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

  // ERROR MESSAGES

  // start time must be at least a minute before end time
  getStartError() {
    if (this.manualTrackingForm.controls.StartTime.hasError('required')) {
      return 'Please enter a value';
    }

    return this.manualTrackingForm.controls.StartTime.hasError('mustMatch') ? 'Invalid start time' : '';
  }

  // end time must be at least a minute after start time
  getEndError() {
    if (this.manualTrackingForm.controls.EndTime.hasError('required')) {
      return 'Please enter a value';
    }

    return this.manualTrackingForm.controls.EndTime.hasError('mustMatch') ? 'End time must occur at least a minute after start time' : '';
  }

  // check time values
  checkTimes(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      var startTime = new Date('2020/01/01 ' + control.value)
      var endTime = new Date('2020/01/01 ' + matchingControl.value)
      var diff = endTime.getTime() - startTime.getTime()
      var mins = diff / 60000
      console.log(mins)

      // set error on matchingControl if validation fails
      if (mins < 1) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }

      return null;
    }
  }
}
