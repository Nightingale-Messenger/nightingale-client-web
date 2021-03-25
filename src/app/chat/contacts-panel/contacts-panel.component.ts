import { Component, OnInit } from '@angular/core';
import {ChatControlService} from '../chat-control.service';
import {User} from '../../core/models';

@Component({
  selector: 'app-contacts-panel',
  templateUrl: './contacts-panel.component.html',
  styleUrls: ['./contacts-panel.component.scss']
})
export class ContactsPanelComponent implements OnInit {
  contacts: User[];

  constructor(private chatNav: ChatControlService) {
    this.contacts = this.chatNav.contacts;
  }

  ngOnInit(): void {}

}
