import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {

  constructor(private modalService: NgbModal, public amService : AccountManagementService) { }

  panelOpenState = false
  name = "John Doe"
  roles : string
  projects : Object[]
  tasks : Object[] = []
  tasksNum : any = '-'
  tasksDone : any = '-'
  tasksDue : any = '-'
  slides : number = 0
  upcoming : Object[] = []

  // forms
  addProjectForm : FormGroup
  editProjectForm : FormGroup

  error : string = null

  ngOnInit(): void {
    this.roles = localStorage.getItem('roles');

    /**********
    FORM GROUPS
    ***********/

    // add project
    this.addProjectForm = new FormGroup({
      name : new FormControl('', [Validators.required]),
      date : new FormControl('', [Validators.required])
    });

    // edit project
    this.editProjectForm = new FormGroup({
      name : new FormControl('', [Validators.required]),
      date : new FormControl('', [Validators.required])
    });

    this.getProAndTasks()
  }

  

  /********
  API CALLS
  *********/

  // get projects and tasks
  getProAndTasks()
  {
    this.amService.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      this.projects = data['projects']
      this.getTasks()
    },
    error => {
      console.log(error);
      this.error = error.statusText
    }); 
  }

  // add project
  addProject(form : NgForm) {
    console.log(form)
  }

  // edit project
  editProject(form : NgForm) {

  }

  // delete project
  deleteProject() {

  }

  //get tasks
  getTasks() {
    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i]['dueDate'] = Date.parse(this.projects[i]['dueDate'])
      var temp : Object[] = this.projects[i]['tasks']
      for (let j = 0; j < temp.length; j++) {
        temp[j]['projectID'] = this.projects[i]['ID']
        temp[j]['projectName'] = this.projects[i]['projectName']
        temp[j]['dueDate'] = Date.parse(temp[j]['dueDate'])
        this.tasks.push(temp[j])
      }
    }

    // sort tasks according to due date
    this.tasks.sort((a : any, b : any) => a.dueDate - b.dueDate)
    console.log(this.tasks)

    // get week details
    var startDate = new Date()
    var endDate = startDate.getDate()+6
    console.log(startDate + ' AND ' + endDate)
    this.tasksNum = this.tasks.filter((t : any) => t.taskStatus == 'Completed').length

    this.tasksDone = this.tasks.filter((t : any) => t.taskStatus == 'Completed').length
    this.tasksDue = this.tasks.length - this.tasksDone
    this.slides = Math.ceil(this.tasksDue / 4)

    // get upcoming tasks
    let tempTasks : Object[] = this.tasks.filter((t : any) => t.taskStatus != 'Completed')

    while (tempTasks.length) {
      this.upcoming.push(tempTasks.splice(0,4))
    }
    console.log(this.upcoming)
  }

  // get correct date format
  formatDate(d : Date) {
    const options = {
      year: "numeric",
      month:"short",
      day:"2-digit"
    }
    return new Date(d).toLocaleDateString('en-US', options)
  }

  /****
  MODAL
  ****/
  closeResult: string;

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

}
