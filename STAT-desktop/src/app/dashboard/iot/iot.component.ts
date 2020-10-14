import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IotManagementService } from 'src/app/shared/services/iot-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-iot',
  templateUrl: './iot.component.html',
  styleUrls: ['./iot.component.sass']
})
export class IOTComponent implements OnInit {

  roles : string[] = ['Data Analyst', 'System Administrator', 'Security Administrator', 'Team Leader', 'General Team Member'];
  devices : any[];
  dID : string
  deviceName : string
  addDeviceForm : FormGroup;
  constructor(private modalService: NgbModal,public headerService : HeaderService, public iotService : IotManagementService ) { }

  ngOnInit(): void {
    /*this.devices = [
      {'deviceName': 'Left Camera - Lobby', 'macAddress': '111.203.75', 'description': 'Block B'},
      {'deviceName': 'Card scanner - Reception', 'macAddress': '273.895.23', 'description': 'Admin Building'},
      {'deviceName': 'Camera - Parking Entrance', 'macAddress': '888.759.28', 'description': 'Basement level B'},
      {'deviceName': 'Fingerprint Scanner', 'macAddress': '985.346.89', 'description': 'VIP Offices'},
      {'deviceName': 'Iris Scanner', 'macAddress': '995.274.78', 'description': 'Vault'},
    ];*/

    this.addDeviceForm = new FormGroup({
      deviceName : new FormControl('',[Validators.required]),
      macAddress : new FormControl('',[Validators.required]),
      description : new FormControl('')
    });

    this.getDevices();
  }

  getDevices() {
    this.iotService.getDevices(localStorage.getItem('token')).subscribe((data) => {
      this.devices = data['iotDevices'];
      console.log(data['iotDevices'])
    },
    error => {
      //console.log(error)
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });

  }

  registerDevice(form : NgForm) {
    this.iotService.registerDevice(localStorage.getItem('token'),form).subscribe((data) => {
      this.getDevices();
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  deregisterDevice(deviceID : string) {
    var values = {'deviceID': deviceID};
    this.iotService.deregisterDevice(localStorage.getItem('token'),values).subscribe((data) => {
      this.getDevices();
    },
    error => {
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        this.headerService.kickOut();
      }
    });
  }

  /*** MODAL ***/
  closeResult: string;

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
}
