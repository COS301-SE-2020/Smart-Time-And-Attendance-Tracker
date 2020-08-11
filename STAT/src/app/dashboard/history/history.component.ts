import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {
  displayedColumns = ['date', 'startTime', 'endTime', 'activeTime', 'description', 'project', 'task', 'value', 'member'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() { }
  ngOnInit(): void {
  }
}

export interface Element {
  date : string;
  startTime : string;
  endTime : string;
  activeTime : string;
  description : string;
  project : string;
  task : string;
  value: string;
  member : string;
}

const ELEMENT_DATA: Element[] = [
  {date : '10 Month', startTime : '00:00', endTime : '01:05', activeTime : '3h 42m', description : 'Firefox', project : 'Avengers Assemble', task : 'Look awesome', value : 'R 23.14', member : 'Sebastian Stan'},
  {date : '10 Month', startTime : '00:00', endTime : '19:33', activeTime : '1h 35m', description : 'Google Chrome', project : 'Capstone', task : 'History screen', value : 'R 0.00', member : 'Zac Efron'}
];
