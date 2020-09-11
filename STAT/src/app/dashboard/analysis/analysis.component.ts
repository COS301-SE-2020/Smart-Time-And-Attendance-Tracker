import {Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { AnalysisService } from 'src/app/shared/services/analysis.service';
import { HeaderService } from 'src/app/shared/services/header.service';

// chart.js
import { Chart } from 'chart.js';

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

  date : Date = new Date()
  date1 : Date = new Date()
  date2 : Date = new Date()
  date3 : Date = new Date()
  date4 : Date = new Date()
  date5 : Date = new Date()
  date6 : Date = new Date()
  dates : any[] = []

  // performance - daily number of hours
  dailyValues : any[] = [0, 0, 0, 0, 0, 0, 0]
  dailyChart : []
  meanDailyHours : number = 0

  // total task times
  tasksTimes : any[] = []
  taskTimesChart : []

  // device breakdown
  devices : any[] = []
  devicesChart : []

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

    // set dates
    this.date1.setDate(this.date.getDate()-1)
    this.date2.setDate(this.date.getDate()-2)
    this.date3.setDate(this.date.getDate()-3)
    this.date4.setDate(this.date.getDate()-4)
    this.date5.setDate(this.date.getDate()-5)
    this.date6.setDate(this.date.getDate()-6)

    this.dates.push(this.formatDate(this.date))
    this.dates.push(this.formatDate(this.date1))
    this.dates.push(this.formatDate(this.date2))
    this.dates.push(this.formatDate(this.date3))
    this.dates.push(this.formatDate(this.date4))
    this.dates.push(this.formatDate(this.date5))
    this.dates.push(this.formatDate(this.date6))

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
      let daily = data['totalDailyValues']
      daily.forEach((element : any) => {
        if (element['_id'] == this.dates[0]) {
          this.dailyValues[0] = element['totalTime'] / 60
        }

        if (element['_id'] == this.dates[1]) {
          this.dailyValues[1] = element['totalTime'] / 60
        }

        if (element['_id'] == this.dates[2]) {
          this.dailyValues[2] = element['totalTime'] / 60
        }

        if (element['_id'] == this.dates[3]) {
          this.dailyValues[3] = element['totalTime'] / 60
        }

        if (element['_id'] == this.dates[4]) {
          this.dailyValues[4] = element['totalTime'] / 60
        }

        if (element['_id'] == this.dates[5]) {
          this.dailyValues[5] = element['totalTime'] / 60
        }

        if (element['_id'] == this.dates[6]) {
          this.dailyValues[6] = element['totalTime'] / 60
        }
      });
      console.log(this.dailyValues)

      this.dailyValues.forEach((element : any) => {
        this.meanDailyHours += element
      });
      this.meanDailyHours = this.meanDailyHours / 7
      this.meanDailyHours = Math.round((this.meanDailyHours + Number.EPSILON) * 100) / 100

      // create chart
      this.dailyChart = new Chart(
        'dailyChart', {
          type: 'line',
          data: { 
            datasets: [{
              data: this.dailyValues
            }],
            labels: this.dates
          }
        }
      )
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
      this.tasksTimes = data['totalTasksTimes']
      this.tasksTimes.forEach((element : any) => {
        if (element._id == 'Unspecified')
          this.tasksTimes.splice(this.tasksTimes.indexOf(element), 1)
      });
      // create chart
      this.taskTimesChart = new Chart(
        'taskTimesChart', {
          type: 'bar',
          data: { 
            datasets: [{
              data: this.tasksTimes.map(t => t.totalTime)
            }],
            labels: this.tasksTimes.map(t => t._id)
          }
        }
      )      
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

      this.devices = data['totalDevices']

      // create chart
      this.devicesChart = new Chart(
        'devicesChart', {
          type: 'pie',
          data: { 
            datasets: [{
              data: this.devices.map(t => t.count),
              backgroundColor: [
                '#87CEFA',
                '#FF4040',
                '#FF82AB',
                '#FFFAC0',
                '#EED8AE',
                '#B8860B',
                '#90EE90',
                '#6495ED'
            ]
            }],
            labels: this.devices.map(t => t._id)
          },
          options: {
            legend: {
                position: 'right',
                labels: {usePointStyle: true, fontSize: 15}
            }
          }
        }
      )
    
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

  formatDate(date : Date) {
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
}
