import {Injectable} from '@angular/core';
import {ChatService, UserService} from '../core/services';
import {Subject} from 'rxjs';
import {User} from '../core/models';
import {distinctUntilChanged} from 'rxjs/operators';

@Injectable()
export class ChatControlService {
  get currTimeZone(): string {
    return this.CurrTimeZone;
  }

  private selectedContactSubject = new Subject<User>();
  public selectedContact = this.selectedContactSubject
    .asObservable()
    .pipe(distinctUntilChanged((prev, curr) => {
      return prev === curr;
    }));

  private contactsSubject = new Subject<User[]>();
  public contactsObservable = this.contactsSubject.asObservable();

  private CurrTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // tslint:disable-next-line:variable-name
  private _selectedId = '';

  public contacts: User[];

  constructor(private chatService: ChatService,
              private userService: UserService) {
    this.contacts = chatService.getContacts();

    this.chatService.contactsObservable.subscribe(value => {
      this.contacts.push(value);
    });

    this.chatService.searchResult.subscribe(value => {
      if (value.length > 0) {
        this.contactsSubject.next(value);
      } else {
        this.contactsSubject.next(this.contacts);
      }
    });

    this.selectedContact.subscribe(val => {
      this.chatService.askLastMessagesFromUser(val.id);
      // this.shownMessages = chatService.getMessagesFrom(val);
    });

    this.userService.isAuthenticated
      .subscribe(
        (val) => {
          if (!val) {
            this.contacts = [];
            this.contactsSubject.next(this.contacts);
            this._selectedId = '';
            this.selectedContactSubject.next({} as User);
          } else {
            this.contacts = chatService.getContacts();
          }
        }
      );
  }

  public selectContact(user: User): void {
    this.selectedContactSubject.next(user);
    this._selectedId = user.id;
  }

  public get selectedId(): string {
    return this._selectedId;
  }

  public Search(usr: string): void {
    console.log(`searching for ${usr}`);
    this.chatService.search(usr.trim());
  }
}
