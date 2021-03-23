import { Component, OnInit } from '@angular/core';
import {AuthService, UserService} from '../../../core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public loggedIn = false;

  constructor(private userService: UserService,
              private authService: AuthService) {
    userService.isAuthenticated.subscribe(value => this.loggedIn = value);
  }

  ngOnInit(): void {
  }

  public onLogout(): void {
    this.authService.logout();
  }

}
