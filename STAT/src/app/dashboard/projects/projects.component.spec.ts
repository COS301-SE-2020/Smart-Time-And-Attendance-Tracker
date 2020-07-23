import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController  } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectsComponent } from './projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserModule, By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import { MaterialComponentsModule } from 'src/app/material-components/material-components.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('Unit tests', () => {
describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsComponent ],
      imports:
        [ HttpClientTestingModule,
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
          MaterialComponentsModule,
          MatProgressSpinnerModule
        ],
      providers: [
        FormsModule,
        ReactiveFormsModule,
        MaterialComponentsModule,
        MatProgressSpinnerModule
      ]
    })
    .compileComponents().then(()=>
    {
      fixture = TestBed.createComponent(ProjectsComponent);

      component = fixture.componentInstance;

      fixture.detectChanges();
      el = de.nativeElement;

    });
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the open method when the add button is pressed', async(() => {
    spyOn(component,'open');
    el = fixture.debugElement.query(By.css("#addPro")).nativeElement;
    el.click();
    expect(component.open).toHaveBeenCalledTimes(1);
  }));
  it("should call the addProject method when the 'Create Project' button is pressed", async(() => {
    spyOn(component,'addProject');
    el = fixture.debugElement.query(By.css("#addProject")).nativeElement;
    el.click();
    expect(component.addProject).toHaveBeenCalledTimes(1);
  }));

  it("should call the addTask method when the 'Create Task' button is pressed", async(() => {
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
        expect(component.addTaskForm.controls.email.hasError('taskName')).toBe(true);
        expect(component.addTaskForm.controls.password.hasError('dueDate')).toBe(true);
      }));

    });
    // ****************************************** END
});
});