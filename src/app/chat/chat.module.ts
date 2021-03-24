import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { ContactComponent } from './contact/contact.component';
import {ChatRoutingModule} from './chat-routing.module';



@NgModule({
  declarations: [ChatComponent, MessageComponent, ContactComponent],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
