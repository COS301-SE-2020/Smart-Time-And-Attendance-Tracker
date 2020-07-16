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

  tasks : any
  

  ngOnInit(): void { 
    this.manualTrackingForm = new FormGroup({
      Description : new FormControl(''),
      TaskID : new FormControl('', [Validators.required]),
      MonetaryValue : new FormControl('', [Validators.required]),
      Date : new FormControl('', [Validators.required]),
      StartTime : new FormControl('', [Validators.required]),
      EndTime : new FormControl('', [Validators.required])
    });

    this.automaticTrackingForm = new FormGroup({
      Description : new FormControl(''),
      TaskID : new FormControl('', [Validators.required]),
    });
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

  //Add an automatic time entry from form
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
        this.getTasks();
        
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

  // get tasks
  getTasks()
  {
    this.service.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    },
    error => {
      console.log(error);
    
    }); 
  }

  // get tracking entries
  getEntries(date : string) {
    this.amService.getTimeEntries(date, localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
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

}
