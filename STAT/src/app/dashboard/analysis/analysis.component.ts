import {Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { AnalysisService } from 'src/app/shared/services/analysis.service';
import { HeaderService } from 'src/app/shared/services/header.service';

// chart.js
import { Chart } from 'chart.js';
import { TrackingService } from 'src/app/shared/services/tracking.service';

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

  projects : any[] = []
  tasks : any[] = [0, 0, 0, 0]
  projectsBD : any[] = [0, 0, 0]

  // values
  numProjects : any = '-'
  numTasks : any = '-'
  numOverdue : any = '-'
  numWorked : any = '-'
  numEarned : any = '-'
  numUnder = 0

  // performance - daily number of hours
  dailyValues : any[] = [0, 0, 0, 0, 0, 0, 0]
  dailyChart : any = []
  meanDailyHours : number = 0
  meanDailyEarnings : any = 0

  monetaryValues : any[] = [0, 0, 0, 0, 0, 0, 0]
  monetaryChart : any = []

  // total project times
  projectTimes : any = []
  projectTimesChart : []
  barChartColors : any = [
    'rgba(54, 108, 235, 0.4)',
    'rgba(255, 40, 133, 0.4)'
  ]
  borderColors : any = ['#366ceb', '#ff2885']

  // total task times
  tasksTimes : any[] = []
  taskTimesChart : []

  // device breakdown
  devices : any[] = []
  devicesChart : []

  // task breakdown
  tasksBDChart : []

  // project breakdown
  projectsBDChart : []

  // progress bars
  progress : any[] = []

  // project view
  dailyProjects : any[] = []
  projectCharts : any[] = []

  // predictive
  predictions : any[] = []
  predictiveCharts : any[] = []

  constructor(private cd: ChangeDetectorRef, public aService: AnalysisService, public service : TrackingService, public headerService: HeaderService) { }

  ngOnInit(): void {
    this.reset()
    
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

  reset() {
    this.getDailyValues();
    //this.getProjectDailyValues("5f3d4cdc5f704424503cff44");
    this.getDailyMoney();
    this.getDevices();
    this.getWeeklyProjectsTimes();
    this.getWeeklyTasksTimes();
    //this.getProjectMembersTotalTime("5f3d4cdc5f704424503cff44");
    this.getPredictionsForWeekForProjects();
    this.getProAndTasks()

    // reset variables
    this.numProjects = '-'
    this.numTasks = '-'
    this.numOverdue = '-'
    this.numWorked = '-'
    this.numEarned = '-'
    this.numUnder = 0
  }

  toggleAnalysis()
  {
    let temp = this.graphical;
    this.graphical = this.predictive;
    this.predictive = temp;
    this.cd.detectChanges();
    window.dispatchEvent(new Event('resize'));
    //this.reset()
  }

  toggleView()
  {
    let temp = this.meView;
    this.meView = this.projectView;
    this.projectView = temp;
    this.cd.detectChanges();
    window.dispatchEvent(new Event('resize'));
    if (this.meView == true)
      this.reset()
  }

  //Get user's daily totals for the last week
  getDailyValues()
  {
    this.aService.getDailyValues(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      let daily = data['totalDailyValues']
      daily.forEach((element : any) => {
        if (element['_id'] == this.dates[0]) {
          this.dailyValues[0] = element['totalTime']
        }

        if (element['_id'] == this.dates[1]) {
          this.dailyValues[1] = element['totalTime']
        }

        if (element['_id'] == this.dates[2]) {
          this.dailyValues[2] = element['totalTime']
        }

        if (element['_id'] == this.dates[3]) {
          this.dailyValues[3] = element['totalTime']
        }

        if (element['_id'] == this.dates[4]) {
          this.dailyValues[4] = element['totalTime']
        }

        if (element['_id'] == this.dates[5]) {
          this.dailyValues[5] = element['totalTime']
        }

        if (element['_id'] == this.dates[6]) {
          this.dailyValues[6] = element['totalTime']
        }
      });
      console.log(this.dailyValues)

      let tempWorked = 0
      this.dailyValues.forEach((element : any) => {
        tempWorked += element

        if (element == 0)
          this.numUnder++
      });

      this.numWorked = this.getTime(tempWorked)
      this.meanDailyHours = tempWorked / 7 / 60
      this.meanDailyHours = Math.round((this.meanDailyHours + Number.EPSILON) * 100) / 100

      // create chart
      this.dailyChart = new Chart(
        'dailyChart', {
          type: 'line',
          data: { 
            datasets: [{
              data: this.dailyValues.map(d => Math.round(( (d / 60) + Number.EPSILON) * 100) / 100),
              backgroundColor: 'rgba(54, 108, 235, 0.4)',
              pointColor: '#366ceb',
              borderColor: '#366ceb',
              borderWidth: 1
            }
          ],
            labels: this.dates
          },
          responsive: false,
          options: {
            legend: {
              display: false
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
//Get project's daily totals for the last week (for team lead)
  getProjectDailyValues(projectID : string)
  {
    this.aService.getProjectDailyValues(localStorage.getItem('token'), projectID).subscribe((data) => {
      //console.log(data);

      let index = this.dailyProjects.findIndex((a : any) => a.ID === projectID)
      this.dailyProjects[index].daily = data['totalDailyValues']
      console.log(this.dailyProjects)
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
    
      let daily = data['totalDailyValues']
      daily.forEach((element : any) => {
        if (element['_id'] == this.dates[0]) {
          this.monetaryValues[0] = element['totalAmount']
        }

        if (element['_id'] == this.dates[1]) {
          this.monetaryValues[1] = element['totalAmount']
        }

        if (element['_id'] == this.dates[2]) {
          this.monetaryValues[2] = element['totalAmount']
        }

        if (element['_id'] == this.dates[3]) {
          this.monetaryValues[3] = element['totalAmount']
        }

        if (element['_id'] == this.dates[4]) {
          this.monetaryValues[4] = element['totalAmount']
        }

        if (element['_id'] == this.dates[5]) {
          this.monetaryValues[5] = element['totalAmount']
        }

        if (element['_id'] == this.dates[6]) {
          this.monetaryValues[6] = element['totalAmount']
        }
      });
      console.log(this.monetaryValues)

      let tempEarned = 0
      this.monetaryValues.forEach(element => {
        tempEarned += element
      });

      this.numEarned = 'R' + Math.round((tempEarned + Number.EPSILON) * 100) / 100
      this.meanDailyEarnings = 'R' + Math.round(((tempEarned / this.numProjects ) + Number.EPSILON) * 100) / 100

      //  generate chart
      this.monetaryChart = new Chart(
        'monetaryChart', {
          type: 'line',
          data: { 
            datasets: [{
              data: this.monetaryValues,
              backgroundColor: 'rgba(23, 232, 131, 0.4)',
              pointColor: '#17e883',
              borderColor: '#17e883',
              borderWidth: 1
            }
          ],
            labels: this.dates
          },
          responsive: false,
          options: {
            legend: {
              display: false
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
  //Get user's time for each project for the last week
  getWeeklyProjectsTimes()
  {
    this.aService.getWeeklyProjectsTimes(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);

      this.projectTimes = data['totalProjectsTimes']
      this.numProjects = this.projectTimes.length
      this.projectTimes.forEach((element : any) => {
        if (element._id == 'Unspecified')
          --this.numProjects
      });

      let colors = []
      let borders = []
      let count = 0
      for (let i = 0; i < this.projectTimes.length; i++) {
        if (this.projectTimes[i].totalTime == 0) {
          colors.push('#000000')
          borders.push('#000000')
        } else {
          colors.push(this.barChartColors[count % this.barChartColors.length])
          borders.push(this.borderColors[count % this.borderColors.length])
          count++
        }
      }

      // create chart
      this.projectTimesChart = new Chart(
        'projectTimesChart', {
          type: 'bar',
          data: { 
            datasets: [{
              data: this.projectTimes.map(t => Math.round(( (t.totalTime / 60) + Number.EPSILON) * 100) / 100),
              backgroundColor: colors,
              borderWidth: 1,
              borderColor : borders
            }],
            labels: this.projectTimes.map(t => t._id)
          },
          options: {
            legend: {
              display: false
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
  //Get user's time for each task for the last week
  getWeeklyTasksTimes()
  {
    this.aService.getWeeklyTasksTimes(localStorage.getItem('token')).subscribe((data) => {
      console.log(data);
      this.tasksTimes = data['totalTasksTimes']
      this.numTasks = this.tasksTimes.length
      this.tasksTimes.forEach((element : any) => {
        if (element._id == 'Unspecified') {
          --this.numTasks
          this.tasksTimes.splice(this.tasksTimes.indexOf(element), 1)
        }

        if (element._id != 'Unspecified' && element.projectName != 'Unspecified')
          this.progress.push(element)
      });
      
      console.log(this.tasksTimes)
      console.log(this.progress)
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
                '#ff2885',
                '#366ceb',
                '#8368fc',
                '#39c0ff'
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
      this.predictions = data['results']
      console.log(this.predictions)
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

  // get projects and tasks
  getProAndTasks()
  {
    this.service.getProjectsAndTasks(localStorage.getItem('token')).subscribe((data) => {
      console.log(data)
      this.projects = data['projects']

      let tempTasks = []
      this.projectsBD = [0,0,0]
      this.projects.forEach((element : any) => {
        let due = Date.parse(element.dueDate.replace(/\-/g, '/'))
        let today = this.date.getTime()
        if (element.completed == false && due < today)
          this.projectsBD[2]++
        else if (element.completed == false)
          this.projectsBD[0]++
        else
          this.projectsBD[1]++

        element.tasks.forEach((t : any) => {
          tempTasks.push(t)
        });
      });

      console.log(this.projectsBD)

      // tasks breakdown
      this.tasks = [0,0,0,0]
      tempTasks.forEach((element : any) => {
        let due = Date.parse(element.dueDate.replace(/\-/g, '/'))
        let today = this.date.getTime()
        if (element.taskStatus.toUpperCase() != 'COMPLETED' &&  due < today) // if overdue
          this.tasks[3]++
        else if (element.taskStatus == 'Not Started')
          this.tasks[0]++
        else if (element.taskStatus == 'In Progress')
          this.tasks[1]++
        else
          this.tasks[2]++
      });

      this.numOverdue = this.tasks[3]

      // create project chart
      this.projectsBDChart = new Chart(
        'projectsBDChart', {
          type: 'pie',
          data: { 
            datasets: [{
              data: this.projectsBD,
              backgroundColor: [
                '#39c0ff',
                '#17e883',
                '#ff444e'
            ]
            }],
            labels: ['Upcoming', 'Completed', 'Overdue']
          },
          options: {
            legend: {
                position: 'right',
                labels: {usePointStyle: true, fontSize: 15}
            }
          }
        }
      )

      // create task chart
      this.tasksBDChart = new Chart(
        'tasksBDChart', {
          type: 'pie',
          data: { 
            datasets: [{
              data: this.tasks,
              backgroundColor: [
                '#ff2885',
                '#39c0ff',
                '#17e883',
                '#ff444e'
            ]
            }],
            labels: ['Not Started', 'In Progress', 'Completed', 'Overdue']
          },
          options: {
            legend: {
                position: 'right',
                labels: {usePointStyle: true, fontSize: 15}
            }
          }
        }
      )

      // project analysis
      this.dailyProjects = []
      this.projects.forEach((element : any) => {
        this.dailyProjects.push(element)
        this.getProjectDailyValues(element.ID)
      });
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }

  // project analysis
  getProjectAnalysis() {

    // generate charts
    console.log(this.dailyProjects)
    this.projectCharts = []
    this.dailyProjects.forEach((element : any) => {
      let temp = new Chart(
        element.ID, {
          type: 'line',
          data: { 
            datasets: [{
              data: element.daily.map(d => Math.round(( (d.totalTime / 60) + Number.EPSILON) * 100) / 100),
              backgroundColor: 'rgba(200,155,200,0.7)',
              pointBorderColor: '#87CEFA'
            }
          ],
            labels: this.dates
          },
          options: {
            legend: {
              display: false
            }
          }
        }
      )

      element.chart = temp
    });
  }

  // predictive analysis
  getPredictive() {
    // generate charts
    console.log(this.predictions)
    this.predictiveCharts = []
    this.predictions.forEach((element : any) => {
      element.ID = 'p' + element.projectID
      let temp = new Chart(
        element.ID, {
          type: 'line',
          data: { 
            datasets: [{
              data: element.predictions.map(d => Math.round(( (d / 60) + Number.EPSILON) * 100) / 100),
              backgroundColor: 'rgba(200,155,200,0.5)',
              pointBorderColor: '#87CEFA'
            }
          ],
            labels: this.dates
          },
          options: {
            legend: {
              display: false
            }
          }
        }
      )

      element.chart = temp
    });
    
  }

  // get time spent
  getTime(mins : number) {
    var hours = Math.floor(mins / 60)
    var rem = mins % 60
    return (hours + 'h ' + rem + 'm')
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
