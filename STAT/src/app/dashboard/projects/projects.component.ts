import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { ProjectManagementService } from 'src/app/shared/services/project-management.service';
import { TeamManagementService } from 'src/app/shared/services/team-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {

  constructor(private modalService: NgbModal, public headerService : HeaderService, public amService : AccountManagementService, public pmService : ProjectManagementService, public tmService : TeamManagementService) { }

  panelOpenState = false
  name = "John Doe"
  roles : string
  allProjects : Object[]
  projects : Object[]
  tasks : Object[] = []
  tasksNum : number
  tasksDone : number
  tasksDue : number
  loading : boolean = true
  slides : number = 0
  upcoming : Object[] = []

  // forms
  addProjectForm : FormGroup
  addTaskForm : FormGroup
  pid : string
  tid : string
  pname : string
  tname : string
  projectToEdit : any
  taskToEdit : any

  searchProj : string = null
  showComp : boolean = false
  searchMem : string = null

  allMembers : []
  members : any[]
  availMembers : any[]

  error : string = null

  ngOnInit(): void {
    // reset forms
    this.resetProjectForm()
    this.resetTaskForm()

    this.roles = localStorage.getItem('roles');

    /**********
    FORM GROUPS
    ***********/

    // add project
    this.addProjectForm = new FormGroup({
      projectName : new FormControl('', [Validators.required]),
      dueDate : new FormControl('', [Validators.required]),
      hourlyRate : new FormControl('', [Validators.required])
    });

    // add task
    this.addTaskForm = new FormGroup({
      taskName : new FormControl('', [Validators.required]),
      dueDate : new FormControl('', [Validators.required]),
      projectID : new FormControl('')
    });

    this.getProAndTasks()
    this.getMembers()
  }


  stopPropagation(event){
    event.stopPropagation();
    // console.log("Clicked!");
  }

  /********
  API CALLS
  *********/

  // get projects and tasks
  getProAndTasks()
  {
    this.amService.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      this.allProjects = data['projects']
      this.projects = this.allProjects.sort((a : any, b : any) => Date.parse(a.dueDate) - Date.parse(b.dueDate) || a.projectName - b.projectName)
      this.projects = this.projects.filter((x : any) => x['completed'] == false)
      this.getTasks()
      this.error = 'none'
    },
    error => {
      //console.log(error);
      //this.error = error.statusText
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  // add project
  addProject(form : NgForm) {
    console.log(form);
    this.pmService.addProject(localStorage.getItem('token'),form).subscribe((data) => {
      console.log(data);
      this.getProAndTasks()
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
  //add task
  addTask(form : NgForm) {
    form['projectID'] = this.pid
    console.log(form);
    this.pmService.addTask(localStorage.getItem('token'),form).subscribe((data) => {
      console.log(data);
      this.getProAndTasks()
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

  // edit project (projectID must be added to body)
  editProject(form : NgForm) {
    console.log(form)
    this.pmService.editProject(localStorage.getItem('token'),form).subscribe((data) => {
      console.log(data);
      this.getProAndTasks()
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
  // edit task (taskID must be added to body)
  editTask(form : NgForm) {
    console.log(form)
    this.pmService.editTask(localStorage.getItem('token'),form).subscribe((data) => {
      console.log(data);
      this.getProAndTasks()
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

  // delete project
  deleteProject(projectID : String) {
    this.pmService.deleteProject(localStorage.getItem('token'),projectID).subscribe((data) => {
      //console.log('ID' + projectID)
      console.log(data);
      this.getProAndTasks()
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
  // delete task
  deleteTask(taskID : String, projectID : String) {
    this.pmService.deleteTask(localStorage.getItem('token'),taskID,projectID).subscribe((data) => {
      console.log(data);
      this.getProAndTasks()
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

  //mark project as completed
  completeProject(projectID : String) {
    let req ={"projectID": projectID}
    this.pmService.completeProject(localStorage.getItem('token'),req).subscribe((data) => {
      console.log(data);

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

  //mark task as started
  startTask(taskID : String) {
    let req ={"taskID": taskID}
    this.pmService.startTask(localStorage.getItem('token'),req).subscribe((data) => {
      console.log(data);

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
  //mark task as completed
  completeTask(taskID : String) {
    let req ={"taskID": taskID}
    this.pmService.completeTask(localStorage.getItem('token'),req).subscribe((data) => {
      console.log(data);
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
  //get tasks
  getTasks() {
    this.tasks = []
    this.upcoming = []

    for (let i = 0; i < this.projects.length; i++) {
      this.projects[i]['dueDate'] = Date.parse(this.projects[i]['dueDate'])
      var temp : Object[] = this.projects[i]['tasks']

      // if there are no tasks
      if (temp.length != 0) {
        for (let j = 0; j < temp.length; j++) {
          temp[j]['projectID'] = this.projects[i]['ID']
          temp[j]['projectName'] = this.projects[i]['projectName']
          temp[j]['dueDate'] = Date.parse(temp[j]['dueDate'])
          this.tasks.push(temp[j])
        }
      }
    }

    // sort tasks according to due date
    this.tasks.sort((a : any, b : any) => a.dueDate - b.dueDate || a.taskName - b.taskName)
    console.log(this.tasks)

    // get week details
    var startDate = new Date()
    var s = this.convertDate(startDate)
    console.log(startDate)
    var endDate = startDate.getDate()+1
    var weekTasks = this.tasks.filter((t : any) => this.formatDate(t.dueDate) == this.formatDate(startDate))
    console.log(weekTasks)
    this.tasksNum = this.tasks.length

    this.tasksDone = this.tasks.filter((t : any) => t.taskStatus == 'Completed').length
    this.tasksDue = this.tasksNum - this.tasksDone

    this.loading = false
    this.slides = Math.ceil(this.tasksDue / 4)


    // get upcoming tasks
    let tempTasks : Object[] = this.tasks.filter((t : any) => t.taskStatus != 'Completed')

    while (tempTasks.length) {
      this.upcoming.push(tempTasks.splice(0,4))
    }
    console.log(this.upcoming)
  }

  sortProTasks(tasks : any) {
    tasks.sort((a : any, b : any) => a.dueDate - b.dueDate || a.taskName - b.taskName)
    return tasks
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

  // format date
  convertDate(date : Date) {
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

  // search projects
  searchProjects(text : string) {
    // only search upcoming projects
    if (this.searchProj && !this.showComp) {
      this.projects = this.allProjects.filter((x : any) =>
        x['projectName'].toLowerCase().includes(text.toLowerCase()) &&
        x['completed'] == false
      )

    // search all projects - including completed ones
    } else if (this.searchProj && this.showComp) {
      this.projects = this.allProjects.filter((x : any) =>
        x['projectName'].toLowerCase().includes(text.toLowerCase())
      )

    // show all projects - including completed ones
    } else if (!this.searchProj && this.showComp) {
      this.projects = this.allProjects

    // default - all projects in progress
    } else if (!this.searchProj && !this.showComp) {
      this.projects = this.allProjects.filter((x : any) =>
        x['completed'] == false
      )
    }

  }

  // toggle completed projects visibility
  completed() {
    this.showComp = !this.showComp
    if (this.showComp) { // show all
      this.projects = this.allProjects
      document.getElementById('show-comp').setAttribute('hidden', 'true')
      document.getElementById('hide-comp').removeAttribute('hidden')
    } else { // show in progress
      this.projects = this.allProjects.filter((x : any) => x['completed'] == false)
      document.getElementById('hide-comp').setAttribute('hidden', 'true')
      document.getElementById('show-comp').removeAttribute('hidden')
    }
  }


      /*** TEAM MANAGEMENT ***/

      // get members
      getMembers() {
        this.amService.getAllUsers(localStorage.getItem('token')).subscribe((data) => {
          this.allMembers = data['users'];
          // sort alphabetically
          this.allMembers.sort((a : any ,b : any) =>
            a.name.localeCompare(b.name) || a.surname.localeCompare(b.surname) || a.email.localeCompare(b.email)
          );
          this.members = this.allMembers
          console.log(this.allMembers)
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

      // search members
      searchMembers(text : string) {
        if (!this.searchMem)
          this.members = this.availMembers
        this.members = this.availMembers.filter((x : any) =>
          x['name'].toLowerCase().includes(text.toLowerCase()) ||
          x['surname'].toLowerCase().includes(text.toLowerCase()) ||
          x['email'].toLowerCase().includes(text.toLowerCase())
        )
      }

      // get all the members that are not in the team already
      getAvailableMembers(members : Object[]) {
        this.availMembers = this.allMembers.filter((m) => members.findIndex(a => a['ID'] === m['ID']))
        this.members = this.availMembers
      }

      // get teams
      getTeam() {

      }
      // add team
      addTeam(form : NgForm) {
        console.log(form);
        this.pmService.addTeam(localStorage.getItem('token'), form).subscribe((data) => {
          console.log(data);
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

      // add team member
      addTeamMember(form : NgForm) {
        console.log(form);
        this.tmService.addTeamMember(localStorage.getItem('token'), form).subscribe((data) => {
          console.log(data);
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


  // reset forms
  resetProjectForm() {
    this.projectToEdit = {'projectID' : '', 'projectName' : '', 'dueDate' : '', 'hourlyRate' : 0}
  }

  resetTaskForm() {
    this.taskToEdit = {'taskID' : '', 'taskName' : '', 'dueDate' : ''}
  }

  // populate forms
  popProjectForm(p : any) {
    this.projectToEdit.projectID = p.ID
    this.projectToEdit.projectName = p.projectName
    this.projectToEdit.dueDate = new Date(p.dueDate).toISOString().substring(0,10)
    this.projectToEdit.hourlyRate = p.hourlyRate
  }

  popTaskForm(t : any) {
    this.taskToEdit.taskID = t.ID
    this.taskToEdit.taskName = t.taskName
    this.taskToEdit.dueDate = new Date(t.dueDate).toISOString().substring(0,10)
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
