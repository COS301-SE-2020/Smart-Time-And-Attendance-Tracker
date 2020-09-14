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
  progressColors = [
    '#0ac2f0', '#4b6ebf', '#d372f3', '#ff4db8',
    '#70D2FF', '#FF70AE', '#b128de', '#3A0FFA',
    '#6b4bfb', '#0AB1FF', '#1652DF', '#F5006A'
  ]

  // project view
  dailyProjects : any[] = []
  projectCharts : any[] = []
  projectMembers : any = []
  projectColors : any = [
    'rgba(54, 108, 235, 0.4)',
    'rgba(255, 40, 133, 0.4)',
    'rgba(54, 108, 235, 0.4)',
    'rgba(131, 104, 252, 0.4)'
  ]
  projectBorderColors : any = [
    'rgba(54, 108, 235, 1)',
    'rgba(255, 40, 133, 1)',
    'rgba(54, 108, 235, 1)',
    'rgba(131, 104, 252, 1)'
  ]

  // predictive
  predictions : any[] = []
  predictiveCharts : any[] = []

  // view
  view : string = 'me'

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
    this.getDailyMoney();
    this.getDevices();
    this.getWeeklyProjectsTimes();
    this.getWeeklyTasksTimes();
    this.getProAndTasks()
    this.getPredictionsForWeekForProjects();

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
    
    if (this.predictive == false) {
      this.meView = true
      this.projectView = false
      this.reset()
    }

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
      let count = 0
      this.dailyValues.forEach((element : any) => {
        tempWorked += element

        let d = new Date(this.dates[count]).getDay()
        console.log(d)
        if (element < 240 && d != 0 && d != 6)
          this.numUnder++
        count++
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
      this.meanDailyEarnings = 'R' + Math.round(((tempEarned / 7 ) + Number.EPSILON) * 100) / 100

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

      // task percentage
      if (this.tasksTimes) {
        this.tasksTimes.forEach((t : any) => {
            let pIndex = this.projectTimes.findIndex((a : any) => a.projectID === t.projectID)
            let projectTotal = this.projectTimes[pIndex].totalTime
            t.percentage = t.totalTime / projectTotal * 100  
            console.log(t)
        });
      }
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
      });
      
      console.log(this.tasksTimes)

      this.progress = []
      this.tasksTimes.forEach((element : any) => {
        let index = this.progress.findIndex((a : any) => a.projectID === element.projectID)
        if (index == -1) {
          let temp = {'projectID' : element.projectID, 'projectName' : element.projectName, 'taskTimes' : [element]}
          this.progress.push(temp)
        } else {
          this.progress[index].taskTimes.push(element)
        }
      });

      this.progress.forEach((element : any) => {
        element.totalTime = 0
        element.taskTimes.forEach((t : any) => {
          element.totalTime += t.totalTime
        });
      });

      let count = 0
      this.progress.forEach((element : any) => {
        element.taskTimes.forEach((t : any) => {
          t.percent = ((t.totalTime / element.totalTime) * 100) + '%'
          t.color = this.progressColors[count % 12]
          count++
        });
      });

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
      let index = this.dailyProjects.findIndex((a : any) => a.ID === projectID)
      this.dailyProjects[index].membersTimes = data['membersTotalTime']
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
        this.getProjectMembersTotalTime(element.ID)
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

    this.dailyProjects.forEach((element : any) => {

      // daily performance values
      for (let i = 0; i < this.dates.length; i++) {
        let index = element.daily.findIndex((a : any) => a._id === this.dates[i])
        if (index == -1 )
          element.daily.push({'_id' : this.dates[i], 'totalTime' : 0})
      }
      element.daily = element.daily.sort((a : any ,b : any) => Date.parse(b._id) - Date.parse(a._id));

      // overdue tasks
      element.overdue = 0
      element.completed = 0
      element.tasks.forEach((t : any) => {
        if (Date.parse(t.dueDate) < this.date.getTime() && t.taskStatus != 'Completed')
          element.overdue++

        if (t.taskStatus == 'Completed')
          element.completed++
      });

      element.completed = Math.round(((element.completed / element.tasks.length) + Number.EPSILON) * 100)

      if (isNaN(element.completed))
        element.completed = 0

      // total and average
      element.total = 0
      element.average = 0
      element.daily.forEach((d : any) => {
        element.total += d.totalTime
      });

      element.average = Math.round(((element.total / 7 / 60) + Number.EPSILON) * 100) / 100

      // monetary values
      element.monetary = Math.round((((element.total / 60) * element.hourlyRate) + Number.EPSILON) * 100) / 100

      // members
      element.unproductive = []
      console.log(this.dailyProjects)
      if (element.membersTimes) {
        element.membersTimes.forEach((m : any) => {
          if (m.timeSpent == 0) {
            element.unproductive.push(m)
            element.membersTimes.splice(element.membersTimes.indexOf(m), 1)
          }
        });
      }

    });

    // generate charts
    console.log(this.dailyProjects)
    this.projectCharts = []
    let count = 0
    this.dailyProjects.forEach((element : any) => {
      let temp = new Chart(
        element.ID, {
          type: 'line',
          data: { 
            datasets: [{
              data: element.daily.map(d => Math.round(( (d.totalTime / 60) + Number.EPSILON) * 100) / 100),
              backgroundColor: this.projectColors[count % 4],
              pointColor: this.projectBorderColors[count % 4],
              borderColor: this.projectBorderColors[count % 4],
              borderWidth: 1
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
      count++
    });
  }

  // predictive analysis
  getPredictive() {
    // dates
    let date1 : Date = new Date()
    let date2 : Date = new Date()
    let date3 : Date = new Date()
    let date4 : Date = new Date()
    let date5 : Date = new Date()
    let date6 : Date = new Date()
    let date7 : Date = new Date()

    // set dates
    date1.setDate(this.date.getDate()+1)
    date2.setDate(this.date.getDate()+2)
    date3.setDate(this.date.getDate()+3)
    date4.setDate(this.date.getDate()+4)
    date5.setDate(this.date.getDate()+5)
    date6.setDate(this.date.getDate()+6)
    date7.setDate(this.date.getDate()+7)

    let tempDates = []

    tempDates.push(this.formatDate(date1))
    tempDates.push(this.formatDate(date2))
    tempDates.push(this.formatDate(date3))
    tempDates.push(this.formatDate(date4))
    tempDates.push(this.formatDate(date5))
    tempDates.push(this.formatDate(date6))
    tempDates.push(this.formatDate(date7))

    // monetary values
    let counter = 0
    let count = 0
    this.predictions.forEach((element : any) => {
      let index = this.dailyProjects.findIndex((a : any) => a.ID === element.projectID)
      let rate = this.dailyProjects[index].hourlyRate

      let values = element.predictions.map(d => Math.abs(Math.round(( ((d / 60) + Number.EPSILON) * 100) * rate) / 100))
      console.log(values)

      let chartName = 'monetary' + counter.toString()
      element.chartName = chartName

      let temp = new Chart(
        element.projectName, {
          type: 'line',
          data: { 
            datasets: [{
              data: values,
              backgroundColor: 'rgba(23, 232, 131, 0.4)',
              pointColor: '#17e883',
              borderColor: '#17e883',
              borderWidth: 1
            }
          ],
            labels: tempDates
          },
          options: {
            legend: {
              display: false
            }
          }
        }
      )

      element.mchart = temp
      counter++

    });

    // generate charts
    console.log(this.predictions)
    this.predictiveCharts = []
    count = 0
    this.predictions.forEach((element : any) => {
      //element.ID = 'p' + element.projectID
      let temp = new Chart(
        element.projectID, {
          type: 'line',
          data: { 
            datasets: [{
              data: element.predictions.map(d => Math.abs(Math.round(( (d / 60) + Number.EPSILON) * 100) / 100)),
              backgroundColor: this.projectColors[count % 4],
              pointColor: this.projectBorderColors[count % 4],
              borderColor: this.projectBorderColors[count % 4],
              borderWidth: 1
            }
          ],
            labels: tempDates
          },
          options: {
            legend: {
              display: false
            }
          }
        }
      )

      element.chart = temp
      count++
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
