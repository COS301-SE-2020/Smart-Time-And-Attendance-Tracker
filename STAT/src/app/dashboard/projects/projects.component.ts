import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  panelOpenState = false
  name = "John Doe"
  roles : string

  // forms
  addProjectForm : FormGroup
  editProjectForm : FormGroup

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
  }

  

  /********
  API CALLS
  *********/

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
