import {Component, Input, OnDestroy} from '@angular/core';
import {User} from '../../core/models';
import {ChatControlService} from '../chat-control.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnDestroy {
  // @ts-ignore
  @Input() usr: User;
  public selected = false;
  private selSubscription: Subscription;

  constructor(public chatNav: ChatControlService) {
    this.selSubscription = chatNav.selectedContact.subscribe(value => {
      this.selected = value === this.usr.id;
    });
  }

  public onClick(): void {
    this.chatNav.selectContact(this.usr.id);
  }

  ngOnDestroy(): void {
    this.selSubscription.unsubscribe();
  }
}
