import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import {environment} from '../../../environments/environment';
import {JwtService} from './jwt.service';
import {Message, User} from '../models';
import {Subject} from 'rxjs';
import {UserService} from './user.service';

@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private contacts: User[] = [];
  public started = false;

  private hubConnection: signalR.HubConnection;

  private messagesSubject: Subject<Message> = new Subject<Message>();
  public messagesObservable = this.messagesSubject.asObservable();

  uploadedMessagesSubject: Subject<Message[]> = new Subject<Message[]>();
  public uploadedMessagesObservable = this.uploadedMessagesSubject.asObservable();

  private contactsSubject: Subject<User> = new Subject<User>();
  public contactsObservable = this.contactsSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private jwtService: JwtService,
              private userService: UserService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/messagehub`, {
        accessTokenFactory: () => this.jwtService.accessToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    // this.startConnection();
  }

  public startConnection(): void {
    if (!this.started) {
      this.hubConnection.start()
        .then(() => {
          console.log(' Chat connection started');
          this.started = true;
          this.setupListeners();
          this.askContacts();
        })
        .catch(err => console.log('Error while starting connection: ' + err));
    }
  }

  public setupListeners(): void {
    this.hubConnection.on('ReportError', (msg: string) => {
      console.error(msg);
    });

    this.hubConnection.on('GetMessages', (res: Message[]) => {
      if (res.length < 1) {
        return;
      }
      this.messages = res.reverse().concat(this.messages);
      // console.log(this.messages);
      // this.messagesSubject.next(this.messagesSubject.value.concat(res));
      this.uploadedMessagesSubject.next(res);
    });

    this.hubConnection.on('ReceiveMessage', (msg: Message) => {
      // this.messagesSubject.next(this.messagesSubject.value.concat([msg]));
      this.messages.push(msg);
      this.messagesSubject.next(msg);
      if (!this.contacts.find(value => value.id === msg.sender.id) &&
        msg.sender.id !== this.userService.getId()) {
        this.contacts.push(msg.sender);
        this.contactsSubject.next(msg.sender);
      }
    });

    this.hubConnection.on('GetContacts', (res: User[]) => {
      // this.contactsSubject.next(this.contactsSubject.value.concat(res));
      this.contacts = this.contacts.concat(res);
      for (const contact of res) {
        this.contactsSubject.next(contact);
      }
    });
  }

  public askContacts(): void {
    this.hubConnection.invoke('GetContacts');
  }

  public askLastMessagesFromUser(id: string): void {
    this.hubConnection.invoke('GetLastMessages', id);
  }

  public getNextMessagesBundle(msgId: number): void {
    this.hubConnection.invoke('GetMessagesBeforeId', msgId);
  }

  public sendMessage(receiverId: string, text: string): void {
    if (text.trim() === '') {
      return;
    }
    this.hubConnection.invoke('Send', {
      SenderId: 'sender_id',
      ReceiverId: receiverId,
      Date: new Date(Date.now()).toISOString(),
      Text: text
    });
  }

  public getContacts(): User[] {
    return this.contacts;
  }

  public getMessagesFrom(id: string): Message[] {
    return this.messages.filter(m => m.receiver.id === id ||
      m.sender.id === id);
  }
}
