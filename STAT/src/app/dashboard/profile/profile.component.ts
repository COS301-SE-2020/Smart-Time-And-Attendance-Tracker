import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AccountManagementService } from 'src/app/shared/services/account-management.service';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  name : string
  surname : string
  email : string
  roles : any 
  profilePic : string = 'hi'
  cover : string = '../../../assets/STAT-logo.png'
  fileToUpload : File = null

  constructor(private storage : AngularFireStorage, public service : AccountManagementService, public headerService : HeaderService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')
    this.surname = localStorage.getItem('surname')
    this.roles = localStorage.getItem('roles')
    //this.profilePic = localStorage.getItem('profilePic')
  }

  openFile() {
    document.querySelector('input').click()
  }

  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;

  handle(event : any){
    var n = Date.now();
    const file = event.target.files[0];
    const filePath = `profilePictures/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`profilePictures/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.profilePic = url
              this.addPic(url)
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  //add profile picture
  addPic(pic : String) {
    let req ={"profilePicture": pic}
    this.service.addProfilePicture(localStorage.getItem('token'),req).subscribe((data) => {
      console.log(data);

    },
    error => {
      //console.log(error);
      let errorCode = error['status'];
      if (errorCode == '403')
      {
        //console.log("Your session has expired. Please sign in again.");
        // kick user out
        this.headerService.kickOut();
      }
    });
  }
}
