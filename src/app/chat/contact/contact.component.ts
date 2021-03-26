import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../core/models';
import {ChatControlService} from '../chat-control.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../core/services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @Input() usr: User;
  public selected = false;
  private selSubscription: Subscription;

  constructor(public chatNav: ChatControlService,
              private userService: UserService) {
    this.selSubscription = chatNav.selectedContact.subscribe(value => {
      this.selected = value.id === this.usr.id;
    });
  }

  public onClick(): void {
    this.chatNav.selectContact(this.usr);
  }

  ngOnDestroy(): void {
    this.selSubscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.usr.id === this.userService.getId()) {
      this.usr.userName = 'Saved messages';
    }
  }
}
