import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ɵConsole } from '@angular/core';
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

  constructor(private modalService: NgbModal, public headerService : HeaderService, public service : TrackingService, public amService : AccountManagementService, public sanitizer: DomSanitizer, private cd: ChangeDetectorRef) { }

  stop =false;
  currentTime : number;
  startTime : number;
  timing :number;
  hours: number;
  count;
  sync;
  syncSub;
  countSub;
  projectName: string;
  projectID : string;

  eID : string
  ename : string

  panelOpenState = false;
  closeResult: string;
  manualTrackingForm : FormGroup
  automaticTrackingForm: FormGroup
  form: any
  editEntryForm : FormGroup

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
  entryToEdit : any
  editing : boolean = false
  editingTime : any = 0

  entries : Object[]
  week : Object[] = []
  date : Date = new Date()
  date1 : Date = new Date()
  date2 : Date = new Date()
  date3 : Date = new Date()
  date4 : Date = new Date()
  date5 : Date = new Date()

  activityVal : number = 0
  entriesVal : number = 0
  tasksVal : any[] = []

  trackingNow =false;
  tracking = [] as any;
  currentID : any;

  currentlyTracking = { 'description' : 'No description', 'startTime' : '', 
                                  'activeTime' : 0, 'projectName' : 'Unspecified', 'taskName' : 'Unspecified'}

  @ViewChild('iframe') iframe: ElementRef;

  ngOnInit(): void {
    this.manualTrackingForm = new FormGroup({
      description : new FormControl(''),
      projectID : new FormControl(''),
      taskID : new FormControl(''),
      monetaryValue : new FormControl(''),
      date : new FormControl('', [Validators.required]),
      startTime : new FormControl('', [Validators.required]),
      endTime : new FormControl('', [Validators.required]),
      projectName : new FormControl(''),
      taskName : new FormControl(''),
      activeTime : new FormControl('')
    });

    this.manualTrackingForm.setValidators(this.checkTimes('startTime', 'endTime'));

    this.automaticTrackingForm = new FormGroup({
      projectID : new FormControl(''),
      taskID : new FormControl(''),
      projectName : new FormControl(''),
      taskName : new FormControl('')
    });

    this.editEntryForm = new FormGroup({
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

    this.editEntryForm.setValidators(this.checkTimes('startTime', 'endTime'));

    this.tasks = [ { "ID" : 0, "taskName" : "None" }];

    // set dates
    this.date1.setDate(this.date.getDate()-1)
    this.date2.setDate(this.date.getDate()-2)
    this.date3.setDate(this.date.getDate()-3)
    this.date4.setDate(this.date.getDate()-4)
    this.date5.setDate(this.date.getDate()-5)

    this.reload()
    /*if( JSON.parse(localStorage.getItem("tracking")) != null)
    {
      this.tracking = JSON.parse(localStorage.getItem("tracking"));
      console.log(this.tracking)
      this.track()
    }*/
  
  }
  

  // reload page data
  reload() {
    this.entriesVal = 0
    this.activityVal = 0
    this.tasksVal = []

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

  //Add a manual time entry from form
  addManualEntry(form : NgForm)
  {
    console.log(form.value)
    form['date'] = form['date'].replace(/\-/g, '/')
    this.service.addMTimeEntry(localStorage.getItem('token'), form).subscribe((data) => {
      console.log(data)
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

  editMoney() {
    var startTime = this.entryToEdit.startTime
    var endTime = this.entryToEdit.endTime
    if (startTime && endTime) {
      startTime = new Date('2020/01/01 ' + startTime)
      endTime = new Date('2020/01/01 ' + endTime)
      var diff = endTime.getTime() - startTime.getTime()
      this.entryToEdit.activeTime = Math.floor( diff / 60000);
      var hours = diff / 3600000
      this.entryToEdit.monetaryValue = hours * this.hourlyRate
    }

    if (isNaN(this.entryToEdit.monetaryValue))
      this.entryToEdit.monetaryValue = 0

  }

  //Add an automatic time entry from form
  addAutomaticEntry(form : NgForm)
  {
    this.sync = timer(300000);
    this.count = timer(2000);
    this.service.getActiveWindow().subscribe((data) => {
      console.log(data);
      var id = data['id']
      if (this.tracking[id] == undefined)
      {
        this.tracking[id]= { 'description' : 'No description', 'startTime' : '', 
        'activeTime' : 0, 'projectName' : 'Unspecified', 'taskName' : 'Unspecified', 'isTracking' : true, 'lastUpdate': 0 };
        this.tracking[id]['description'] =  data['title']
        this.currentID = id;
        let now = new Date();
        this.tracking[id]['startTime'] = now.getTime()
      }
      this.form = form;
      this.trackingNow =true;
      this.stop = false;
      let now = new Date();
      this.tracking[this.currentID].activeTime= 0;

      if( form['taskName']!= undefined )
        this.tracking[this.currentID].taskName =form['taskName'];

      if( form['projectName']!= undefined )
        this.tracking[this.currentID].projectName =form['projectName'];
        

      this.startTime = now.getTime();
      localStorage.setItem("form", JSON.stringify(this.form));
      this.tracking[this.currentID].startTime = this.startTime
      localStorage.setItem("tracking", JSON.stringify(this.tracking));
      this.track();
    },
    error => {
      console.log(error)
    });
    
    
  }
  stopAllTracking()
  {
    console.log("Stop");
    this.stop = true;
    this.trackingNow =false;
    for (var key in this.tracking) {
      console.log(key)
      var value = this.tracking[key];
      if(value.lastUpdate < value.activeTime &&value.EntryID != undefined )
      {   
          this.updateEntry(key).subscribe((data) => {
          console.log(data);

        },
        error => {
          console.log(error);
          let errorCode = error['status'];
          if (errorCode == '403')
            this.headerService.kickOut();
    
        });
      }
    }
    this.tracking = []
    localStorage.removeItem("tracking");
    this.countSub.unsubscribe();
    this.syncSub.unsubscribe();

  }

  stopTracking(id)
  {
    console.log("Stop");
    this.stop = true;
    this.trackingNow =false;
    this.tracking[id].isTracking= false;
    
    if(this.tracking[id].lastUpdate < this.tracking[id].activeTime &&this.tracking[id].EntryID != undefined )
    {
    
      this.updateEntry(id).subscribe((data) => {
        console.log(data);
      },
        error => {
    
          console.log(error);
          let errorCode = error['status'];
          if (errorCode == '403')
            this.headerService.kickOut();
          });
    }

    delete this.tracking[id];
    localStorage.setItem("tracking", JSON.stringify(this.tracking));

    if(this.tracking.length == 0)
    {
      this.countSub.unsubscribe();
      this.syncSub.unsubscribe();
    }
  }
  
  track()
  {
    this.trackingNow =true;
    console.log("tracking");
    this.countSub =this.count.subscribe(x => {

      this.service.getActiveWindow().subscribe((data) => {
        //console.log(data);
        var id = data['id']
        if (this.tracking[id] == undefined)
        {
          //console.log("in")
          this.tracking[id]= { 'description' : 'No description', 'startTime' : '', 
          'activeTime' : 0, 'projectName' : 'Unspecified', 'taskName' : 'Unspecified', 'isTracking' : true , 'lastUpdate': 0};
          this.tracking[id]['description'] =  data['title']
          let now = new Date();
          this.tracking[id]['startTime'] = now.getTime()
        }
        this.currentID = id;
        this.tracking[this.currentID].activeTime += 2;
       // console.log(this.tracking[this.currentID].EntryID);
        if(this.tracking[this.currentID] != undefined && this.tracking[this.currentID].activeTime >=60 &&this.tracking[this.currentID].EntryID == undefined )
        {
          //console.log('Hello')
          if(this.tracking[this.currentID].isTracking != false)
          {
            this.tracking[this.currentID].lastUpdate = this.tracking[this.currentID].activeTime;
            var now = new Date();
            this.form = JSON.parse(localStorage.getItem("form"));
            //console.log(this.form)
            if( this.form['taskName']!= undefined )
              this.tracking[this.currentID].taskName =this.form['taskName'];

            if( this.form['projectName']!= undefined )
              this.tracking[this.currentID].projectName =this.form['projectName'];
            this.form['endTime']=  now.getTime();
    
            this.form['activeTime'] = 1;
            this.form['date']= formatDate(now, 'yyyy/MM/dd', 'en-US');
            this.form['startTime']= this.tracking[this.currentID].startTime;
            this.form['description'] = this.tracking[this.currentID].description;
            //console.log( this.form['startTime'])
            this.service.addATimeEntry(this.form, localStorage.getItem('token')).subscribe((data) => {
            this.tracking[this.currentID].EntryID = data['timeEntryID'];
              },
              error => {
                console.log(error);
                let errorCode = error['status'];
                if (errorCode == '403')
                  this.headerService.kickOut();
    
              });
          }
            else
            delete this.tracking[this.currentID];
        }
        localStorage.setItem("tracking", JSON.stringify(this.tracking));
        console.log( this.tracking[this.currentID].activeTime);
        this.track();
      },
      error => {
        console.log(error)
      });
  
       
    });
    this.syncSub =this.sync.subscribe(x => {

      for (var key in this.tracking) {
        console.log(key)
        var value = this.tracking[key];
        if(value.lastUpdate < value.activeTime)
        {   
            this.tracking[key].lastUpdate = this.tracking[key].activeTime;
            localStorage.setItem("tracking", JSON.stringify(this.tracking));
            this.updateEntry(key).subscribe((data) => {
            console.log(data);

          },
          error => {
            console.log(error);
            let errorCode = error['status'];
            if (errorCode == '403')
              this.headerService.kickOut();
      
          });
        }
      }
      
    });

  }

  //Update a time entry
  updateEntry(id)
  {
    console.log("update");
    var endTime = new Date().getTime();

    this.hours =  this.tracking[id].activeTime / 6000;
    if(this.hourlyRate == undefined)
      this.monetaryValue = 0
    else
      this.monetaryValue = this.hours * this.hourlyRate;
 
    if (isNaN(this.monetaryValue))
    {
      this.monetaryValue = 0;
    }
    var time = Math.round(this.tracking[id].activeTime/60)
    let values = {"timeEntryID" :  this.tracking[id].EntryID, "endTime": endTime, "activeTime" :  time," monetaryValue" : this.monetaryValue};
     return this.service.updateTimeEntry(values, localStorage.getItem('token'));

  }

  setEditValues() {
    this.editing = true
    this.editingTime = this.entryToEdit.activeTime
    this.entryToEdit.date = this.entryToEdit.date.replace(/\//g, '-')
    this.entryToEdit.startTime = new Date(this.entryToEdit.startTime).toLocaleString('en-GB', { hour:'numeric', minute:'numeric', hour12:false } )
    this.entryToEdit.endTime = new Date(this.entryToEdit.endTime).toLocaleString('en-GB', { hour:'numeric', minute:'numeric', hour12:false } )
    this.mProjectSelected = this.entryToEdit.projectID
    this.mTaskSelected = this.entryToEdit.taskID
  }

  // edit tracking entry
  editEntry() {
    this.entryToEdit.date = this.entryToEdit.date.replace(/\-/g, '/')

    var startTime = new Date(this.entryToEdit.date + ' ' + this.entryToEdit.startTime); 
    var endTime = new Date(this.entryToEdit.date + ' ' + this.entryToEdit.endTime);
    this.entryToEdit.startTime = startTime.valueOf()
    this.entryToEdit.endTime = endTime.valueOf()
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var activeTime = Math.round(difference / 60000);
    this.editingTime = activeTime - this.editingTime
    this.entryToEdit.activeTime = activeTime

    if (this.mProjectSelected != null) {
      this.entryToEdit.projectID = this.mProjectSelected
      this.entryToEdit.projectName = this.pName
    }

    if (this.mTaskSelected != null) {
      this.entryToEdit.taskID = this.mTaskSelected
      this.entryToEdit.taskName = this.tName
    }

    console.log(this.entryToEdit)

    this.service.updateTimeEntry(this.entryToEdit, localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      switch (this.entryToEdit.date) {
        case this.formatDate(this.date):
          this.week['today'] = []
          this.getEntries(this.formatDate(this.date))
          break
        case this.formatDate(this.date1):
          this.week['yesterday'] = []
          this.getEntries(this.formatDate(this.date1))
          break
        case this.formatDate(this.date2):
          this.week['2days'] = []
          this.getEntries(this.formatDate(this.date2))
          break
        case this.formatDate(this.date3):
          this.week['3days'] = []
          this.getEntries(this.formatDate(this.date3))
          break
        case this.formatDate(this.date4):
          this.week['4days'] = []
          this.getEntries(this.formatDate(this.date4))
          break
        case this.formatDate(this.date5):
          this.week['5days'] = []
          this.getEntries(this.formatDate(this.date5))
          break
      }
      this.reload()

      //this.editing = false
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
    });
  }


  // delete tracking entry
  deleteEntry(id : string) {

    this.service.removeTimeEntry(localStorage.getItem('token'), id).subscribe((data) => {
      console.log(data);
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
    this.reload();

  }

  // get projects and tasks
  getProAndTasks()
  {
    this.service.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      this.projects = data['projects']
    },
    error => {
      let errorCode = error['status'];
      console.log(error)
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

      // values on dashboard
      if (this.editing == false) {
        this.entriesVal += data['timeEntries'].length
      } else {
        this.activityVal -= - this.editingTime
      }

      data['timeEntries'].forEach(element => {
        if (element.taskID != null && !this.tasksVal.includes(element.taskID)) {
          this.tasksVal.push(element.taskID)
        }

        if (this.editing == false)
          this.activityVal += element.activeTime
      });

      if (date == this.formatDate(this.date))
        this.week['today'] = data['timeEntries'].sort((a : any ,b : any) =>
          b.endTime - a.endTime
      );
      if (date == this.formatDate(this.date1))
        this.week['yesterday'] = data['timeEntries'].sort((a : any ,b : any) =>
        b.endTime - a.endTime
      );
      if (date == this.formatDate(this.date2))
        this.week['2days'] = data['timeEntries'].sort((a : any ,b : any) =>
        b.endTime - a.endTime
      );
      if (date == this.formatDate(this.date3))
        this.week['3days'] = data['timeEntries'].sort((a : any ,b : any) =>
        b.endTime - a.endTime
      );
      if (date == this.formatDate(this.date4))
        this.week['4days'] = data['timeEntries'].sort((a : any ,b : any) =>
        b.endTime - a.endTime
      );
      if (date == this.formatDate(this.date5))
        this.week['5days'] = data['timeEntries'].sort((a : any ,b : any) =>
        b.endTime - a.endTime
      );
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
    if (this.manualTrackingForm.controls.startTime.hasError('required')) {
      return 'Please enter a value';
    }

    return this.manualTrackingForm.controls.startTime.hasError('mustMatch') ? 'Invalid start time' : '';
  }

  // end time must be at least a minute after start time
  getEndError() {
    if (this.manualTrackingForm.controls.endTime.hasError('required')) {
      return 'Please enter a value';
    }

    return this.manualTrackingForm.controls.endTime.hasError('mustMatch') ? 'End time must occur at least a minute after start time' : '';
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
