import {Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { AnalysisService } from 'src/app/shared/services/analysis.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.sass']
})
export class AnalysisComponent implements OnInit {

  // analysis type
  graphical: boolean = true;
  predictive: boolean = false;
  // data to display
  meView : boolean = true;
  projectView : boolean = false;

  constructor(private cd: ChangeDetectorRef, public aService: AnalysisService, public headerService: HeaderService) { }

  ngOnInit(): void {
    console.log('Hello');
    this.getDailyValues();
    this.getProjectDailyValues("5f3d4cdc5f704424503cff44");
    this.getDailyMoney();
    this.getDevices();
    this.getWeeklyProjectsTimes();
    this.getWeeklyTasksTimes();
    this.getProjectMembersTotalTime("5f3d4cdc5f704424503cff44");
    this.getPredictionsForWeekForProjects();
  }

  toggleAnalysis()
  {
    let temp = this.graphical;
    this.graphical = this.predictive;
    this.predictive = temp;
    this.cd.detectChanges();
  }

  toggleView()
  {
    let temp = this.meView;
    this.meView = this.projectView;
    this.projectView = temp;
    this.cd.detectChanges();
  }

  //Get user's daily totals for the last week
  getDailyValues()
  {
    this.aService.getDailyValues(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
//Get project's daily totals for the last week (for team lead)
  getProjectDailyValues(projectID : String)
  {
    this.aService.getProjectDailyValues(localStorage.getItem('token'), projectID).subscribe((data) => {
     console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
  //Get user's daily monetary value totals for the last week
  getDailyMoney()
  {
    this.aService.getDailyMoney(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
  //Get user's time for each project for the last week
  getWeeklyProjectsTimes()
  {
    this.aService.getWeeklyProjectsTimes(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
  //Get user's time for each task for the last week
  getWeeklyTasksTimes()
  {
    this.aService.getWeeklyTasksTimes(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
  //Get devices user used for the last week
  getDevices()
  {
    this.aService.getDevices(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
  //Get the amount of time each user spent on the project for the last week (for team lead)
  getProjectMembersTotalTime(projectID : String)
  {
    this.aService.getProjectMembersTotalTime(localStorage.getItem('token'), projectID).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  //Get the prediction for next week for all projects (for team lead)
  getPredictionsForWeekForProjects()
  {
    this.aService.getPredictionsForWeek(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
    
    },
    error => {
      console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }
}
