import { Injectable } from '@angular/core';
import {User} from '../models';

@Injectable()
export class JwtService {

  public get accessToken(): string {
    const t = localStorage.getItem('accessToken');
    if (t) {
      return t;
    }
    return '';
  }

  public set accessToken(value: string) {
    localStorage.setItem('accessToken', value);
  }

  public get refreshToken(): string {
    const t = localStorage.getItem('refreshToken');
    if (t) {
      return t;
    }
    return '';
  }

  public set refreshToken(value: string) {
    localStorage.setItem('refreshToken', value);
  }

  public removeTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public parseUserFromToken(token: string = this.accessToken): User | null {
    if (!token) {
      return null;
    }
    const jwt = JSON.parse(atob(token.split('.')[1]));
    return {id: jwt.Id, userName: jwt.Username};
  }

  public getAccessTokenExp(token: string = this.accessToken): number {
    if (!token) {
      return -1;
    }
    const jwt = JSON.parse(atob(token.split('.')[1]));
    return jwt.exp * 1000;
  }

  public checkAccessTokenExp(token: string = this.accessToken): boolean {
    if (!token) {
      return false;
    }
    return Date.now() > this.getAccessTokenExp(token);
  }
}
