import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthInterceptor } from './interceptors';
import {HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserService,
  AuthService,
  JwtService,
  ChatService} from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UserService,
    AuthService,
    JwtService,
    ChatService
  ]
})
export class CoreModule { }
