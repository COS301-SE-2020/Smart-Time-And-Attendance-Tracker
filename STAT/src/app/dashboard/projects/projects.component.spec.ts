import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectsComponent } from './projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserModule, By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import { MaterialComponentsModule } from 'src/app/material-components/material-components.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectManagementService } from 'src/app/shared/services/project-management.service';
import { of } from 'rxjs';

describe('Unit tests:', () => {
describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let projects;
  let tasks;
  let upcoming;
  let roles;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
          MaterialComponentsModule,
          MatProgressSpinnerModule,
          BrowserAnimationsModule
        ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(ProjectsComponent);
      projects = [ { 'ID': "5f18a3e4e4ccae3398d17951", 'dueDate': 1596153600000, 'hourlyRate': 150, 'projectName': "Botify Music",
      'tasks': [{ 'ID': "5f18a730e4ccae3398d1795c",
      'dueDate': 1595455200000,
      'projectID': "5f18a685e4ccae3398d17957",
      'projectName': "Team Portfolio",
      'taskName': "Get in touch",
      'taskStatus': "In Progress" }] } ]

      tasks = [ { 'ID': "5f18a730e4ccae3398d1795c",
      'dueDate': 1595455200000,
      'projectID': "5f18a685e4ccae3398d17957",
      'projectName': "Team Portfolio",
      'taskName': "Get in touch",
      'taskStatus': "In Progress" }]

      roles = ['Team Leaer'];

      fixture.whenStable().then(() => {
        component = fixture.componentInstance;
        component.projects = projects
        component.tasks = tasks
        component.upcoming = tasks

        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('.row'));
        el = de.nativeElement;
      });
    });
  }));

  it('should create', async() => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  });

  it('the add project button should show if the user is a Team Leader', async(() => {
    component.roles = roles;
    expect(fixture.debugElement.query(By.css("#addPro")).nativeElement).toBeTruthy();
  }));

  it('the add project button should not show if the user is not a Team Leader', async(() => {
    roles=[];
    component.roles = roles;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css("#addPro"))).toBeFalsy();
  }));

  it('should call the open method when the add button is pressed', async(() => {
    spyOn(component,'open');
    el = fixture.debugElement.query(By.css("#addPro")).nativeElement;
    el.click();
    expect(component.open).toHaveBeenCalledTimes(1);
  }));

  it('add project form should be invalid with invalid hourly rate', async(() => {
    component.addProjectForm.controls['hourlyRate'].setValue('-222');
    expect(component.addProjectForm.valid).toBeFalse();
  }));

});
});

describe('Integration tests:', () => {
  describe('ProjectsComponent', () => {
    let component: ProjectsComponent;
    let fixture: ComponentFixture<ProjectsComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let projects;
    let tasks;
    let pmService;
    let roles;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ ProjectsComponent ],
        imports:
          [ HttpClientTestingModule,
            RouterTestingModule,
            FormsModule,
            ReactiveFormsModule,
            MaterialComponentsModule,
            MatProgressSpinnerModule,
            BrowserAnimationsModule
          ],
        providers: [
          FormsModule,
          ReactiveFormsModule,
          MaterialComponentsModule,
          MatProgressSpinnerModule,
          BrowserAnimationsModule
        ]
      })
      .compileComponents().then(()=>
      {
        fixture = TestBed.createComponent(ProjectsComponent);
        projects = [ { 'ID': "5f18a3e4e4ccae3398d17951", 'dueDate': 1596153600000, 'hourlyRate': 150, 'projectName': "Botify Music",
        'tasks': [{ 'ID': "5f18a730e4ccae3398d1795c",
        'dueDate': 1595455200000,
        'projectID': "5f18a685e4ccae3398d17957",
        'projectName': "Team Portfolio",
        'taskName': "Get in touch",
        'taskStatus': "In Progress" }] } ]

        tasks = [ { 'ID': "5f18a730e4ccae3398d1795c",
        'dueDate': 1595455200000,
        'projectID': "5f18a685e4ccae3398d17957",
        'projectName': "Team Portfolio",
        'taskName': "Get in touch",
        'taskStatus': "In Progress" }]

        roles = ['Team Leader'];

        component = fixture.componentInstance;
        component.projects = projects
        component.tasks = tasks
        component.upcoming = tasks
        component.roles = roles;

        fixture.detectChanges();
        pmService = TestBed.get(ProjectManagementService);
        de = fixture.debugElement.query(By.css('.row'));
        el = de.nativeElement;

      });
    }));


    it("should call the addProject method when the 'Create Project' button is pressed", async(() => {
      spyOn(component,'addProject');
      // open add project modal
      el = fixture.debugElement.query(By.css("#addPro")).nativeElement;
      const contentBeforeClick = document.querySelector(".modal-content");
      expect(contentBeforeClick).toBeFalsy();
      el.click();
      const contentAfterClick = document.querySelector(".modal-content");
      expect(contentAfterClick).toBeTruthy();
      // add values to form
      component.addProjectForm.controls['projectName'].setValue('John');
      component.addProjectForm.controls['dueDate'].setValue('2020-12-15');
      component.addProjectForm.controls['hourlyRate'].setValue('2.50');
      fixture.detectChanges();
      // click add project button
      const btn = (<HTMLElement>document.querySelector('button#addProject'));
      console.log(btn);
      btn.click();
      //const btn = fixture.debugElement.query(By.css("#addProject")).nativeElement;
      //btn.textContent = "James";
      //btn.click();
      fixture.detectChanges();
      expect(document.querySelector(".modal-content")).toBeFalsy();
      expect(component.addProject).toHaveBeenCalledTimes(1);
    }));

    /*it("should call the addTask method when the 'Create Task' button is pressed", async(() => {
      spyOn(component,'addTask');
      el = fixture.debugElement.query(By.css("#addTask")).nativeElement;
      el.click();
      expect(component.addTask).toHaveBeenCalledTimes(1);
    }));

    it("should call the editProject method when the 'Create Project' button is pressed", async(() => {
      spyOn(component,'editProject');
      el = fixture.debugElement.query(By.css("#editProject")).nativeElement;
      el.click();
      expect(component.editProject).toHaveBeenCalledTimes(1);
    }));

    it("should call the editTask method when the 'Save Changes' button is pressed", async(() => {
      spyOn(component,'editTask');
      el = fixture.debugElement.query(By.css("#editTask")).nativeElement;
      el.click();
      expect(component.editTask).toHaveBeenCalledTimes(1);
    }));

    it("should call the deleteProject method when the 'Yes' button is pressed", async(() => {
      spyOn(component,'deleteProject');
      el = fixture.debugElement.query(By.css("#deleteProject")).nativeElement;
      el.click();
      expect(component.deleteProject).toHaveBeenCalledTimes(1);
    }));

    it("should call the deleteTask method when the 'Yes' button is pressed", async(() => {
      spyOn(component,'deleteTask');
      el = fixture.debugElement.query(By.css("#deleteTask")).nativeElement;
      el.click();
      expect(component.deleteTask).toHaveBeenCalledTimes(1);
    }));

      describe('Add Project Form', () => {
        it('should be invalid with empty details', async(() => {
          component.addProjectForm.controls['projectName'].setValue('');
          component.addProjectForm.controls['Project'].setValue('');
          component.addProjectForm.controls['hourlyRate'].setValue('');

          expect(component.addProjectForm.valid).toBeFalsy();
          expect(component.addProjectForm.controls.email.hasError('projectName')).toBe(true);
          expect(component.addProjectForm.controls.password.hasError('dueDate')).toBe(true);
          expect(component.addProjectForm.controls.email.hasError('hourlyRate')).toBe(true);
        }));

      });
      // ****************************************** END

      describe('Add Task Form', () => {
        it('should be invalid with empty details', async(() => {
          component.addTaskForm.controls['taskName'].setValue('');
          component.addTaskForm.controls['dueDate'].setValue('');

          expect(component.addTaskForm.valid).toBeFalsy();
          expect(component.addTaskForm.controls.taskName.hasError('taskName')).toBe(true);
          expect(component.addTaskForm.controls.dueDate.hasError('dueDate')).toBe(true);
        }));

      });*/
      // ****************************************** END
  });
  });
