import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../../core/services';
import {ChatControlService} from '../chat-control.service';

@Component({
  selector: 'app-send-msg-form',
  templateUrl: './send-msg-form.component.html',
  styleUrls: ['./send-msg-form.component.scss']
})
export class SendMsgFormComponent implements OnInit {
  public form: FormGroup;

  constructor(private chatService: ChatService,
              private chatCtrl: ChatControlService) {
    this.form = new FormGroup({
      msg: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  public SengMsg(): void {
    if (this.form.valid) {
      this.chatService.sendMessage(this.chatCtrl.selectedId, this.form.value.msg);
      this.form.reset();
    }
  }

}
