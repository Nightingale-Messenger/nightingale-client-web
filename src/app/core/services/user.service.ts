import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models';
import {distinctUntilChanged} from 'rxjs/operators';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable()
    .pipe(distinctUntilChanged((prev, curr) => {
      return prev.id === curr.id;
    }));

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(true);
  public isAuthenticated = this.isAuthenticatedSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public changeCurrentUser(usr: User): void {
    this.currentUserSubject.next(usr);
  }

  public changeAuthStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  public getStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public getUserName(): string {
    return this.currentUserSubject.value.userName;
  }

  public removeUser(): void {
    this.changeCurrentUser({} as User);
    this.changeAuthStatus(false);
  }

  constructor() { }
}
