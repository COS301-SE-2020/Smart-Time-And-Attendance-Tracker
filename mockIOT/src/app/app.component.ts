import { Component } from '@angular/core';


class User {
  public id: string;
  public tracking: boolean;

  constructor(id: string) {
    this.id = id;
    this.tracking = false;
  }

  toggle() {
    this.tracking = !this.tracking;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'mockIOT';
}
