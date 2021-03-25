import {Component, OnInit} from '@angular/core';
import {Message} from '../../core/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public msg = {
    text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."', dateTime: new Date(Date.now()), id: 1,
    sender: {userName: 'Ivan', id: 'sada'},
    receiver: {userName: 'Taras', id: 'ada'}
  } as Message;

  constructor() {
  }

  ngOnInit(): void {
  }

}
