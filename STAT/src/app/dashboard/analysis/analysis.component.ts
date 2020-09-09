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
}
