import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {ChatControlService} from '../chat-control.service';
import {Message} from '../../core/models';
import {ChatService} from '../../core/services';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.scss']
})
export class MessagePanelComponent implements AfterViewChecked {
  public messages: Message[];
  public id = '';
  private lastHeight = 0;
  private lastPos = 0;
  private scrollComm = ScrollCommands.SKIP;

  // @ts-ignore
  @ViewChild('msgblock') private scrollContainer: ElementRef;


  constructor(private chatCtrl: ChatControlService,
              public chatService: ChatService) {
    this.messages = [];
    this.chatCtrl.selectedContact.subscribe(value => {
      if (value !== '') {
        this.messages = this.chatService.getMessagesFrom(value);
        this.id = value;
      }
    });

    this.chatService.messagesObservable.subscribe(value => {

      if (value.receiver.id === this.id) {
        this.messages.push(value);
        this.scrollComm = ScrollCommands.SCROLLDOWN;
      } else if (value.sender.id === this.id) {
        this.messages.push(value);
        this.scrollComm = ScrollCommands.SCROLLDOWN;
      }
    });

    this.chatService.uploadedMessagesSubject.subscribe(value => {
      // console.log(value);
      this.lastHeight = this.scrollContainer.nativeElement.scrollHeight;
      this.lastPos = this.scrollContainer.nativeElement.scrollTop;
      this.scrollComm = ScrollCommands.SCROLLTOELEM;
      this.messages = value.concat(this.messages);
    });
  }

  public onScroll(event: Event): void {
    // console.log(this.scrollContainer.nativeElement.scrollTop);
    if (this.messages.length > 0 &&
      this.scrollContainer.nativeElement.scrollTop === 0) {
      // console.log('ask for next bundle');
      this.chatService.getNextMessagesBundle(this.messages.sort(((a, b) => a.id - b.id))[0].id);
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.nativeElement.scroll({
      top: this.scrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngAfterViewChecked(): void {
    if (this.scrollComm === ScrollCommands.SKIP) {
      return;
    }

    if (this.scrollComm === ScrollCommands.SCROLLDOWN) {
      this.scrollToBottom();
    }

    if (this.scrollComm === ScrollCommands.SCROLLTOELEM) {
      // console.log(`scroll to ${this.scrollContainer.nativeElement.scrollHeight - this.lastHeight + this.lastPos}`);
      this.scrollContainer.nativeElement.scroll({
        top: this.scrollContainer.nativeElement.scrollHeight - this.lastHeight + this.lastPos,
        left: 0
      });
      // this.lastHeight = this.scrollContainer.nativeElement.scrollHeight;
    }
    this.scrollComm = ScrollCommands.SKIP;
  }
}

export enum ScrollCommands {
  SCROLLDOWN,
  SCROLLTOELEM,
  SKIP
}
