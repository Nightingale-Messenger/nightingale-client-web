import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../core/models';
import {ChatControlService} from '../chat-control.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  // @ts-ignore
  @Input() msg: Message;
  public timeZone: string;

  constructor(private chatCtrl: ChatControlService) {
    this.timeZone = chatCtrl.currTimeZone;
  }

  ngOnInit(): void {
  }

}
