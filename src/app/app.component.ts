import {Component, OnInit} from '@angular/core';
import {AuthService} from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nightingale-client-web';

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.tryPopulate();
  }
}
