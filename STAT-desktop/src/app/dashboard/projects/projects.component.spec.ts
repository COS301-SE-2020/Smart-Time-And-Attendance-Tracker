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
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { of, throwError } from 'rxjs';
import { HeaderService } from 'src/app/shared/services/header.service';
import {NO_ERRORS_SCHEMA} from "@angular/core"
import { TeamManagementService } from 'src/app/shared/services/team-management.service';

describe('ProjectsComponent', () => {
describe('Unit tests:', () => {
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
        ],
        schemas:[NO_ERRORS_SCHEMA]
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
        component.roles = roles;

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

  it('add project form should be valid', async(() => {
    component.addProjectForm.controls['projectName'].setValue('Test');
    component.addProjectForm.controls['dueDate'].setValue("2020/08/15");
    component.addProjectForm.controls['hourlyRate'].setValue(0);
    expect(component.addProjectForm.valid).toBeTruthy();
  }));

  it('add project form should be invalid', async(() => {
    component.addProjectForm.controls['dueDate'].setValue("2020/08/15");
    component.addProjectForm.controls['hourlyRate'].setValue(0);
    expect(component.addProjectForm.valid).toBeFalsy();
  }));

  it('add task form should be valid', async(() => {
    component.addTaskForm.controls['taskName'].setValue('Test');
    component.addTaskForm.controls['dueDate'].setValue("2020/08/15");
    expect(component.addTaskForm.valid).toBeTruthy();
  }));

  it('add task form should be invalid', async(() => {
    component.addTaskForm.controls['dueDate'].setValue("2020/08/15");
    expect(component.addTaskForm.valid).toBeFalsy();
  }));

  it('resetProjectForm() should reset project form', async(() => {
    component.resetProjectForm();
    expect(component.projectToEdit).toEqual({'projectID' : '', 'projectName' : '', 'dueDate' : '', 'hourlyRate' : 0});
  }));

  it('resetTaskForm() should reset task form', async(() => {
    component.resetTaskForm();
    expect(component.taskToEdit).toEqual({'taskID' : '', 'taskName' : '', 'dueDate' : ''});
  }));

  it('popProjectForm() should populate the project form', async(() => {
    component.popProjectForm({'ID' : "s2gf5adf5d2g0d2gq2g", 'projectName' : 'Test', 'dueDate' : '2020/08/15', 'hourlyRate' : 250});
    expect(component.projectToEdit).toEqual({'projectID' : "s2gf5adf5d2g0d2gq2g", 'projectName' : 'Test', 'dueDate' : '2020-08-14', 'hourlyRate' : 250});
  }));

  it('popTaskForm() should populate the task form', async(() => {
    component.popTaskForm({'ID' : 'ad1gv5a2d0gsf6a2fad', 'taskName' : 'Cry', 'dueDate' : '2020/09/26'});
    expect(component.taskToEdit).toEqual({'taskID' : 'ad1gv5a2d0gsf6a2fad', 'taskName' : 'Cry', 'dueDate' : '2020-09-25'});
  }));
});
});

describe('ProjectsComponent', () => {
  describe('Integration tests:', () => {
    let component: ProjectsComponent;
    let fixture: ComponentFixture<ProjectsComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let projects;
    let tasks;
    let pmService;
    let hService;
    let amService;
    let tmService;
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
        ],
        schemas:[NO_ERRORS_SCHEMA]
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
        hService = TestBed.get(HeaderService);
        amService = TestBed.get(AccountManagementService);
        tmService = TestBed.get(TeamManagementService);
        de = fixture.debugElement.query(By.css('.row'));
        el = de.nativeElement;

        // pmService = TestBed.get(ProjectManagementService);
        // amService = TestBed.get(AccountManagementService);

        /*var store = {
          token : 'GOOSE'
        };

        spyOn(localStorage, 'getItem').and.callFake(function (key) {console.log("DUCK");
          return store[key];
        });*/

        /*spyOn(component, 'getProAndTasks').and.callFake(function () {console.log("GOOSE");
          component.allProjects = projects;
          component.projects = projects;
          component.getTasks();
        });
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('.row'));
        el = de.nativeElement;*/

      });
    }));


    it("should call the addProject method when the 'Create Project' button is pressed", async(() => {
      spyOn(pmService,'addProject');
      // open add project modal
      el = fixture.debugElement.query(By.css("#addPro")).nativeElement;
      expect(document.querySelector(".modal-content")).toBeFalsy();
      el.click();
      expect(document.querySelector(".modal-content")).toBeTruthy();
      // add values to form
      component.addProjectForm.controls['projectName'].setValue('Unit tests');
      component.addProjectForm.controls['dueDate'].setValue('2020-12-15');
      component.addProjectForm.controls['hourlyRate'].setValue('2.50');
      // detect changes to enable button
      fixture.detectChanges();
      // click add project button
      const btn = (<HTMLElement>document.querySelector('.modal-content button#addProject'));
      btn.click();
      // check if function was called
      fixture.detectChanges();
      expect(document.querySelector(".modal-content")).toBeFalsy();
      expect(pmService.addProject).toHaveBeenCalledTimes(1);
    }));

    it("should call the addTask method when the 'Create Task' button is pressed", async(() => {
      spyOn(pmService,'addTask');
      // open add task modal
      el = fixture.debugElement.query(By.css("#addTask")).nativeElement;
      expect(document.querySelector(".modal-content")).toBeFalsy();
      el.click();
      expect(document.querySelector(".modal-content")).toBeTruthy();
      // add values to form
      component.addTaskForm.controls['taskName'].setValue('Modal tests');
      component.addTaskForm.controls['dueDate'].setValue('2020-12-01');
      // detect changes to enable button
      fixture.detectChanges();
      // click add task button
      const btn = (<HTMLElement>document.querySelector('.modal-content button#addTask'));
      btn.click();
      // check if function was called
      fixture.detectChanges();
      expect(document.querySelector(".modal-content")).toBeFalsy();
      expect(pmService.addTask).toHaveBeenCalledTimes(1);
    }));

    it("should call the editTask method when the 'Save Changes' button is pressed", async(() => {
      spyOn(pmService,'editTask');
      fixture.detectChanges();
      // open edit task modal
      el = fixture.debugElement.query(By.css(".editTaskBtn")).nativeElement;
      expect(document.querySelector(".modal-content")).toBeFalsy();
      el.click();
      expect(document.querySelector(".modal-content")).toBeTruthy();
      // add values to form
      component.taskToEdit = {
          'taskID' : '1',
          'taskName' : "Modal form tests",
          'dueDate' : '2020-12-09'
      }
      // detect changes to enable button
      fixture.detectChanges();
      // click edit task button
      const btn = (<HTMLElement>document.querySelector('.modal-content button#editTask'));
      btn.click();
      // check if function was called
      fixture.detectChanges();
      expect(document.querySelector(".modal-content")).toBeFalsy();
      expect(pmService.editTask).toHaveBeenCalledTimes(1);
    }));

    describe('getProAndTasks()', () => {

      it('should save the projects if called successfully', async(() => {

        spyOn(amService, 'getProjectsAndTasks').and.returnValue(of({projects: []}));
        spyOn(component, 'getTasks');
        component.getProAndTasks();
        
        fixture.detectChanges();
        expect(component.allProjects).toEqual([]);
        expect(component.getTasks).toHaveBeenCalled();

      }));

      it('should catch error and call appropriate functions', async(() => {
        
        spyOn(hService, 'kickOut');
        spyOn(component, 'getTasks');
        spyOn(amService, 'getProjectsAndTasks').and.returnValue(throwError({
          status: 403,
          error: {
            message: 'Access denied'
          }
        }));
        component.getProAndTasks();
        fixture.detectChanges();
        expect(component.getTasks).not.toHaveBeenCalled();
        expect(hService.kickOut).toHaveBeenCalled();
      }));
    });

      describe('addProject()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
          component.addProjectForm.controls['projectName'].setValue('Unit tests');
          component.addProjectForm.controls['dueDate'].setValue('2020-12-15');
          component.addProjectForm.controls['hourlyRate'].setValue('2.50');
          spyOn(pmService, 'addProject').and.returnValue(of({message: "Project added successfully"}));
          spyOn(component, 'getProAndTasks');
          component.addProject(component.addProjectForm.value);
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(component, 'getTasks');
          spyOn(pmService, 'addProject').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.addProject(component.addProjectForm.value);
          fixture.detectChanges();
          expect(component.getTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('editProject()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
          component.addProjectForm.controls['projectName'].setValue('Unit tests');
          component.addProjectForm.controls['dueDate'].setValue('2020-12-15');
          component.addProjectForm.controls['hourlyRate'].setValue('2.50');
          spyOn(pmService, 'editProject').and.returnValue(of({message: "Project added successfully"}));
          spyOn(component, 'getProAndTasks').and.callThrough();
          component.editProject(component.addProjectForm.value);
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(component, 'getProAndTasks');
          spyOn(pmService, 'editProject').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.editProject(component.addProjectForm.value);
          fixture.detectChanges();
          expect(component.getProAndTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('addTask()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {

          spyOn(pmService, 'addTask').and.returnValue(of({message: "Task added successfully"}));
          spyOn(component, 'getProAndTasks').and.callThrough();
          component.addTask(component.addTaskForm.value);
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(component, 'getProAndTasks');
          spyOn(pmService, 'addTask').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.addTask(component.addTaskForm.value);
          fixture.detectChanges();
          expect(component.getProAndTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('editTask()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
          spyOn(pmService, 'editTask').and.returnValue(of({message: "Task updated successfully"}));
          spyOn(component, 'getProAndTasks').and.callThrough();
          component.editTask(component.addTaskForm.value);
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(component, 'getProAndTasks');
          spyOn(pmService, 'editTask').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.editTask(component.addTaskForm.value);
          fixture.detectChanges();
          expect(component.getProAndTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('deleteProject()', () => {

        it('should call the correct functions if valid project is successfully passed', async(() => {
          spyOn(pmService, 'deleteProject').and.returnValue(of({message: "Project deleted successfully"}));
          spyOn(component, 'getProAndTasks').and.callThrough();
          component.deleteProject("0ad21v20f515adad1c5s12cv0v");
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(component, 'getProAndTasks');
          spyOn(pmService, 'deleteProject').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.deleteProject("0ad21v20f515adad1c5s12cv0v");
          fixture.detectChanges();
          expect(component.getProAndTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();
        }));
      });

      describe('deleteTask()', () => {

        it('should call the correct functions if valid task is successfully passed', async(() => {
          spyOn(pmService, 'deleteTask').and.returnValue(of({message: "Task deleted successfully"}));
          spyOn(component, 'getProAndTasks').and.callThrough();
          component.deleteTask("0ad21v20f515adad1c5s12cv0v", "0ad21v20f515adad1c5s12cv0v");
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(component, 'getProAndTasks');
          spyOn(pmService, 'deleteTask').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.deleteTask("0ad21v20f515adad1c5s12cv0v","0ad21v20f515adad1c5s12cv0v");
          fixture.detectChanges();
          expect(component.getProAndTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('resetTask()', () => {

        it('should call the correct functions if valid task is successfully passed', async(() => {
          spyOn(pmService, 'resetTask').and.returnValue(of({message: "Task deleted successfully"}));
          spyOn(hService, 'kickOut');
          component.resetTask("0ad21v20f515adad1c5s12cv0v");
          
          fixture.detectChanges();
          expect(hService.kickOut).not.toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(pmService, 'resetTask').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.resetTask("0ad21v20f515adad1c5s12cv0v");
          fixture.detectChanges();
          expect(hService.kickOut).toHaveBeenCalled();
        }));
      });

        describe('completeTask()', () => {

          it('should call the correct functions if valid task is successfully passed', async(() => {
            spyOn(pmService, 'completeTask').and.returnValue(of({message: "Task deleted successfully"}));
            spyOn(hService, 'kickOut');
            component.completeTask("0ad21v20f515adad1c5s12cv0v");
            
            fixture.detectChanges();
            expect(hService.kickOut).not.toHaveBeenCalled();
    
          }));
    
          it('should catch error and call appropriate functions', async(() => {
            
            spyOn(hService, 'kickOut');
            spyOn(pmService, 'completeTask').and.returnValue(throwError({
              status: 403,
              error: {
                message: 'Access denied'
              }
            }));
            component.completeTask("0ad21v20f515adad1c5s12cv0v");
            fixture.detectChanges();
            expect(hService.kickOut).toHaveBeenCalled();
          }));

      });

      describe('startTask()', () => {

        it('should call the correct functions if valid task is successfully passed', async(() => {
          spyOn(pmService, 'startTask').and.returnValue(of({message: "Task status successfully changed"}));
          spyOn(hService, 'kickOut');
          component.startTask("0ad21v20f515adad1c5s12cv0v");
          
          fixture.detectChanges();
          expect(hService.kickOut).not.toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(pmService, 'startTask').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.startTask("0ad21v20f515adad1c5s12cv0v");
          fixture.detectChanges();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('completeProject()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
          spyOn(hService, 'kickOut');
          spyOn(pmService, 'completeProject').and.returnValue(of({message: "Project marked as completed"}));
          component.completeProject("0ad21v20f515adad1c5s12cv0v");
          
          fixture.detectChanges();
          expect(hService.kickOut).not.toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(pmService, 'completeProject').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.completeProject("0ad21v20f515adad1c5s12cv0v");
          fixture.detectChanges();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('uncompleteProject()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
          spyOn(hService, 'kickOut');
          spyOn(pmService, 'uncompleteProject').and.returnValue(of({message: "Project marked as completed"}));
          component.uncompleteProject("0ad21v20f515adad1c5s12cv0v");
          
          fixture.detectChanges();
          expect(hService.kickOut).not.toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
          
          spyOn(hService, 'kickOut');
          spyOn(pmService, 'uncompleteProject').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          component.uncompleteProject("0ad21v20f515adad1c5s12cv0v");
          fixture.detectChanges();
          expect(hService.kickOut).toHaveBeenCalled();
        }));
      });

      describe('changeTaskStatus()', () => {

        it("should call the correct functions if status is 'Not Started'", async(() => {
          spyOn(component, 'startTask');
          spyOn(component.snackbar, 'open');
          spyOn(component, 'getProAndTasks');
          component.changeTaskStatus("0ad21v20f515adad1c5s12cv0v", "name",'Not Started' );
          
          fixture.detectChanges();
          expect(component.startTask).toHaveBeenCalled();
          expect(component.snackbar.open).toHaveBeenCalled();
          expect(component.getProAndTasks).toHaveBeenCalled();
        }));
  
        it("should call the correct functions if status is 'In Progress'", async(() => {
          spyOn(component, 'completeTask');
          spyOn(component.snackbar, 'open');
          spyOn(component, 'getProAndTasks');
          component.changeTaskStatus("0ad21v20f515adad1c5s12cv0v", "name",'In Progress' );
          
          fixture.detectChanges();
          expect(component.completeTask).toHaveBeenCalled();
          expect(component.snackbar.open).toHaveBeenCalled();
          expect(component.getProAndTasks).toHaveBeenCalled();
        }));

        it("should call the correct functions if status is 'Completed'", async(() => {
          spyOn(component, 'resetTask');
          spyOn(component.snackbar, 'open');
          spyOn(component, 'getProAndTasks');
          component.changeTaskStatus("0ad21v20f515adad1c5s12cv0v", "name",'Completed' );
          
          fixture.detectChanges();
          expect(component.resetTask).toHaveBeenCalled();
          expect(component.snackbar.open).toHaveBeenCalled();
          expect(component.getProAndTasks).toHaveBeenCalled();
        }));
      });

      describe('changeProjectStatus()', () => {

        it("should call the correct functions if status is 'Completed'", async(() => {
          spyOn(component, 'completeProject');
          spyOn(component.snackbar, 'open');
          spyOn(component, 'getProAndTasks');
          component.changeProjectStatus("0ad21v20f515adad1c5s12cv0v", "name",'Completed' );
          
          fixture.detectChanges();
          expect(component.completeProject).toHaveBeenCalled();
          expect(component.snackbar.open).toHaveBeenCalled();
          expect(component.getProAndTasks).toHaveBeenCalled();
        }));
  
        it("should call the correct functions if status is 'Not Started'", async(() => {
          spyOn(component, 'uncompleteProject');
          spyOn(component.snackbar, 'open');
          spyOn(component, 'getProAndTasks');
          component.changeTaskStatus("0ad21v20f515adad1c5s12cv0v", "name","Not Started" );
          
          fixture.detectChanges();
          expect(component.uncompleteProject).toHaveBeenCalled();
          expect(component.snackbar.open).toHaveBeenCalled();
          expect(component.getProAndTasks).toHaveBeenCalled();
        }));

      });

      describe('getMembers()', () => {

        it("should set the correct variables if users are returned", async(() => {
          spyOn(amService, 'getAllUsers').and.returnValue(of({users: ["data"]}));
          component.getMembers();
          
          fixture.detectChanges();          
          expect(component.members).toEqual(["data"]);
        }));
  
        it("should call the correct functions if error is received", async(() => {
          spyOn(amService, 'getAllUsers').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          spyOn(hService, 'kickOut');
          component.getMembers();
          
          fixture.detectChanges();
          expect(component.members).not.toBeDefined();
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('getTeam()', () => {

        it("should set the correct variables if users are returned", async(() => {
          spyOn(tmService, 'getTeams').and.returnValue(of({teams: ["data"]}));
          component.getTeam();
          
          fixture.detectChanges();          
          expect(component.teams).toEqual(["data"]);
          expect(component.availTeams).toEqual(["data"]);
        }));
  
        it("should call the correct functions if error is received", async(() => {
          spyOn(tmService, 'getTeams').and.returnValue(throwError({
            status: 403,
            error: {
              message: 'Access denied'
            }
          }));
          spyOn(hService, 'kickOut');
          component.getTeam();
          
          fixture.detectChanges();
          expect(component.teams).not.toBeDefined();
          expect(component.availTeams).toEqual([]);
          expect(hService.kickOut).toHaveBeenCalled();
        }));

      });

      describe('addTeam()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
          component.pid = "sfnvjsfg02sb2s0fg";
          component.tid ="dg0v0sf1g5sf1b20s2fg0";
      
          spyOn(pmService, 'addTeam').and.returnValue(of({message: "Team added successfully"}));
          spyOn(component, 'getProAndTasks');
          component.addTeam();
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
            component.pid = "sfnvjsfg02sb2s0fg";
            component.tid ="dg0v0sf1g5sf1b20s2fg0";
        
            spyOn(pmService, 'addTeam').and.returnValue(throwError({
              status: 403,
              error: {
                message: 'Access denied'
              }
            }));
            spyOn(component, 'getProAndTasks');
            spyOn(hService, 'kickOut');
            component.addTeam();
            
            fixture.detectChanges();
            expect(component.getProAndTasks).not.toHaveBeenCalled();
          expect(hService.kickOut).toHaveBeenCalled();

        }));
      });

      describe('addTeamMember()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
      
          spyOn(pmService, 'addTeamMember').and.returnValue(of({message: "Team added successfully"}));
          spyOn(component, 'getProAndTasks');
          component.addTeamMember("dag45g0a2d05a2d", "sd5gv02sg5qd02ad0", "Coder");
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
            spyOn(pmService, 'addTeamMember').and.returnValue(throwError({
              status: 403,
              error: {
                message: 'Access denied'
              }
            }));
            spyOn(component, 'getProAndTasks');
            spyOn(hService, 'kickOut');
            component.addTeamMember("dag45g0a2d05a2d", "sd5gv02sg5qd02ad0", "Coder");
            
            fixture.detectChanges();
            expect(component.getProAndTasks).not.toHaveBeenCalled();
            expect(hService.kickOut).toHaveBeenCalled();

        }));
      });

      describe('addMembersToProject()', () => {

        it('should call the correct functions for the array elements', async(() => {
      
         component.addMembers = [{ID: "0s25g15s1d0g21",role: "Tester" },{ID: "0s25g15s1d0g22",role: "Coder" }];
         component.pid ="0sfg31w2f0w0f";
          spyOn(component, 'addTeamMember');
          component.addMembersToProject();
          
          fixture.detectChanges();
          expect(component.addTeamMember).toHaveBeenCalledTimes(2);
  
        }));
      });
      
      describe('removeProjectMember()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
      
          spyOn(pmService, 'removeTeamMember').and.returnValue(of({message: "Member removed successfully"}));
          spyOn(component, 'getProAndTasks');
          component.removeProjectMember("dag45g0a2d05a2d");
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
            spyOn(pmService, 'removeTeamMember').and.returnValue(throwError({
              status: 403,
              error: {
                message: 'Access denied'
              }
            }));
            spyOn(component, 'getProAndTasks');
            spyOn(hService, 'kickOut');
            component.removeProjectMember("dag45g0a2d05a2d");
            
            fixture.detectChanges();
            expect(component.getProAndTasks).not.toHaveBeenCalled();
            expect(hService.kickOut).toHaveBeenCalled();

        }));
      });

      describe('removeMembersFromProject()', () => {

        it('should call the correct functions for the array elements', async(() => {
      
         component.removeMembers = [{ID: "0s25g15s1d0g21",role: "Tester" },{ID: "0s25g15s1d0g22",role: "Coder" }];
          spyOn(component, 'removeProjectMember');
          component.removeMembersFromProject();
          
          fixture.detectChanges();
          expect(component.removeProjectMember).toHaveBeenCalledTimes(2);
          expect(component.removeMembers).toEqual([]);
  
        }));
      });

      describe('changeRole()', () => {

        it('should call the correct functions if valid form is successfully passed', async(() => {
      
          spyOn(pmService, 'changeRole').and.returnValue(of({message: "Member role changed successfully"}));
          spyOn(component, 'getProAndTasks');
          component.changeRole("dag45g0a2d05a2d","sd5gv02sg5qd02ad0", "Coder");
          
          fixture.detectChanges();
          expect(component.getProAndTasks).toHaveBeenCalled();
  
        }));
  
        it('should catch error and call appropriate functions', async(() => {
            spyOn(pmService, 'changeRole').and.returnValue(throwError({
              status: 403,
              error: {
                message: 'Access denied'
              }
            }));
            spyOn(component, 'getProAndTasks');
            spyOn(hService, 'kickOut');
            component.changeRole("dag45g0a2d05a2d","sd5gv02sg5qd02ad0", "Coder");
            
            fixture.detectChanges();
            expect(component.getProAndTasks).not.toHaveBeenCalled();
            expect(hService.kickOut).toHaveBeenCalled();

        }));
      });

      describe('editMemberRoles()', () => {

        it('should call the correct functions for the array elements', async(() => {
      
         component.editRoles = [{ID: "0s25g15s1d0g21",role: "Tester" },{ID: "0s25g15s1d0g22",role: "Coder" }];
         component.pid = "woijrgsf03w5100";
          spyOn(component, 'changeRole');
          component.editMemberRoles();
          
          fixture.detectChanges();
          expect(component.changeRole).toHaveBeenCalledTimes(2);
          expect(component.editRoles).toEqual([]);
  
        }));
      });

  /*  it("should call the editProject method when the 'Edit Project' button is pressed", async(() => {
      spyOn(component,'editProject');
      el = fixture.debugElement.query(By.css("#editProject")).nativeElement;
      el.click();
      expect(component.editProject).toHaveBeenCalledTimes(1);
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
