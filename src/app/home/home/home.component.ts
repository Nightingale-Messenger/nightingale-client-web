import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public loggedIn = false;
  public userName = '';

  constructor(private userService: UserService) {
    this.userName = userService.getUserName();
    this.loggedIn = userService.getStatus();
    userService.isAuthenticated.subscribe(value => this.loggedIn = value);
    userService.currentUser.subscribe(value => this.userName = value.userName);
  }

  ngOnInit(): void {
  }

}
