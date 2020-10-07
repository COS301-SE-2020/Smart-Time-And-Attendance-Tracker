import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private router : Router) { }

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // force sign out when token expires
  kickOut()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('profilePic')
    this.isUserLoggedIn.next(false);

    this.router.navigate(['/sign-in']);
  }
}
