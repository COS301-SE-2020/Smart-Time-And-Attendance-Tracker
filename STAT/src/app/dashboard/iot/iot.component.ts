import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.sass']
})
export class IOTComponent implements OnInit {

  roles : string[] = ['Data Analyst', 'System Administrator', 'Security Administrator', 'Team Leader', 'General Team Member']
  devices : any;

  constructor() { }

  ngOnInit(): void {
    this.devices = [
      {'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
      {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'},
      {'deviceName': 'Camera - Parking Entrance', 'macAddress': '888.759.28', 'description': 'Basement level B'},
      {'deviceName': 'Fingerprint Scanner', 'macAddress': '985.346.89', 'description': 'VIP Offices'},
      {'deviceName': 'Iris Scanner', 'macAddress': '995.274.78', 'description': 'Vault'},
    ];
  }

}
