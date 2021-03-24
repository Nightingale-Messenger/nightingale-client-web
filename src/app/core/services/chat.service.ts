import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import {environment} from '../../../environments/environment';
import {JwtService} from './jwt.service';
import {Message, User} from '../models';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ChatService {
  private hubConnection: signalR.HubConnection;

  private messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public messages = this.messagesSubject.asObservable();

  private contactsSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public contacts = this.contactsSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private jwtService: JwtService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/messagehub`, {
        accessTokenFactory: () => this.jwtService.accessToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection.start()
      .then(() => console.log(' Chat connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public setupListeners(): void {
    this.hubConnection.on('ReportError', (msg: string) => {
      console.error(msg);
    });

    this.hubConnection.on('GetMessages', (res: Message[]) => {
      this.messagesSubject.next(this.messagesSubject.value.concat(res));
    });

    this.hubConnection.on('ReceiveMessage', (msg: Message) => {
      this.messagesSubject.next(this.messagesSubject.value.concat([msg]));
      if (!this.contactsSubject.value.find(value => value.id === msg.sender.id)) {
        this.contactsSubject.value.push(msg.sender);
        this.contactsSubject.next(this.contactsSubject.value);
      }
    });

    this.hubConnection.on('GetContacts', (res: User[]) => {
      this.contactsSubject.next(this.contactsSubject.value.concat(res));
    });
  }

  public getContacts(): void {
    this.hubConnection.invoke('GetContacts');
  }

  public getLastMessagesFromUser(id: string): void {
    this.hubConnection.invoke('GetLastMessages', id);
  }

  public getNextMessagesBundle(msgId: number): void {
    this.hubConnection.invoke('GetMessagesBeforeId', msgId);
  }

  public sendMessage(receiverId: string, text: string): void {
    this.hubConnection.invoke('Send', {
      SenderId: 'sender_id',
      ReceiverId: receiverId,
      Date: new Date(Date.now()).toISOString(),
      Text: text
    });
  }
}
