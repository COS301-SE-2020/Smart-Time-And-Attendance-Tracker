import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.sass']
})
export class TodayComponent implements OnInit {
  

  constructor(private modalService: NgbModal, public service : TrackingService, public amService : AccountManagementService) { }

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

  entries : Object[]
  week : Object[]

  ngOnInit(): void { 
    this.manualTrackingForm = new FormGroup({
      Description : new FormControl(''),
      Project : new FormControl(''),
      TaskID : new FormControl('', [Validators.required]),
      MonetaryValue : new FormControl('', [Validators.required]),
      Date : new FormControl('', [Validators.required]),
      StartTime : new FormControl('', [Validators.required]),
      EndTime : new FormControl('', [Validators.required])
    });

    this.automaticTrackingForm = new FormGroup({
      Description : new FormControl(''),
      Project : new FormControl('', [Validators.required]),
      TaskID : new FormControl('', [Validators.required]),
    });

    this.tasks = [ { "ID" : 0, "taskName" : "None" }];
    this.getProAndTasks()
    this.getEntries('2020-07-13')
    this.getWeekInfo()
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
      console.log(data);
    },
    error => {
      console.log(error);
      //console.log(error.error.message);  
    
    }); 
  }

  //Add an automatic time entry from form
  addAutomaticEntry(form : NgForm)
    {
      
        this.service.addATimeEntry(form, localStorage.getItem('token')).subscribe((data) => {
        console.log(data);
        this.service.EntryID = data['TimeEntryID'];
        this.getProAndTasks();
        
      },
      error => {
        console.log(error);
        //console.log(error.error.message);  
      
      }); 
  }

  //Update a time entry. Parameters are the new end time and active time
  updateEntry(endTime, activeTime)
  {
      endTime =  new Date().getTime();
      activeTime = 10;
      let values = {"TimeEntryID" : this.service.EntryID, "EndTime": endTime, "ActiveTime" : activeTime};  
      this.service.updateTimeEntry(values, localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    },
    error => {
      console.log(error);
      //console.log(error.error.message);  
    
    }); 
  }

  // get projects and tasks
  getProAndTasks()
  {
    this.service.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      this.projects = data['projects']
      console.log(this.projects)
    },
    error => {
      console.log(error);
    
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
      }
    } else {
      if (this.mProjectSelected == null)
      this.tasks = [ { "ID" : 0, "taskName" : "None" }];
      else {
        this.mTasksDisabled = false;
        this.tasks = this.projects.find((p : any) => p.ID == projectID)['tasks'];
      }
    }
    
    return this.tasks;
  }

  // get tracking entries
  getEntries(date : string) {
    this.amService.getTimeEntries(localStorage.getItem('token'), date).subscribe((data) => {
      console.log(data);
      this.entries = data['entries']
    },
    error => {
      console.log(error);
    }); 
  }

  // format date
  formatDate(date : Date) {
    var y = date.getFullYear().toString();
    var m = (date.getMonth()+1).toString();
    var d = date.getDay().toString();

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

  getWeekInfo() {
    var startDate = new Date()
    for (let i = 0; i < 6; i++) {
      console.log(this.formatWeekDate(startDate))
      startDate.setDate(startDate.getDate()-1)
    }

    //this.week['today'] = this.getEntries()
  }

  // get correct date format
  formatWeekDate(d : Date) {
    const options = {
      month:"long",
      day:"2-digit"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

}
