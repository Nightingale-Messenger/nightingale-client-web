import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NoAuthGuard} from './no-auth.guard';
import {AuthRoutingModule} from './auth-routing.module';
import { AuthComponent } from './auth/auth.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule {
}
