import {Injectable} from '@angular/core';
import {ChatService} from '../core/services';
import {Subject} from 'rxjs';
import {User} from '../core/models';
import {distinctUntilChanged} from 'rxjs/operators';

@Injectable()
export class ChatControlService {
  get currTimeZone(): string {
    return this.CurrTimeZone;
  }
  private selectedContactSubject = new Subject<string>();
  public selectedContact = this.selectedContactSubject
    .asObservable()
    .pipe(distinctUntilChanged((prev, curr) => {
      return prev === curr;
    }));

  private CurrTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // tslint:disable-next-line:variable-name
  private _selectedId = '';

  public contacts: User[];

  constructor(private chatService: ChatService) {
    this.contacts = chatService.getContacts();

    this.chatService.contactsObservable.subscribe(value => {
      this.contacts.push(value);
    });

    this.selectedContact.subscribe(val => {
      this.chatService.askLastMessagesFromUser(val);
      // this.shownMessages = chatService.getMessagesFrom(val);
    });
  }

  public selectContact(id: string): void {
    this.selectedContactSubject.next(id);
    this._selectedId = id;
  }

  public get selectedId(): string {
    return this._selectedId;
  }
}
