import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { ContactComponent } from './contact/contact.component';
import {ChatRoutingModule} from './chat-routing.module';
import { MessagePanelComponent } from './message-panel/message-panel.component';
import { ContactsPanelComponent } from './contacts-panel/contacts-panel.component';
import {ChatControlService} from './chat-control.service';
import { SendMsgFormComponent } from './send-msg-form/send-msg-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import { SearchFormComponent } from './search-form/search-form.component';



@NgModule({
  declarations: [ChatComponent,
    MessageComponent,
    ContactComponent,
    MessagePanelComponent,
    ContactsPanelComponent,
    SendMsgFormComponent,
    SearchFormComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    ChatControlService
  ]
})
export class ChatModule { }
