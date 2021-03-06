import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JwtService} from './jwt.service';
import {UserService} from './user.service';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Tokens} from '../models';
import {ChatService} from './chat.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  // @ts-ignore
  private refreshTokenTimeout: NodeJS.Timeout = 0;

  constructor(private httpClient: HttpClient,
              private jwtService: JwtService,
              private userService: UserService,
              private chatService: ChatService,
              private router: Router) {
  }

  public tryPopulate(): void {
    console.log('Trying to get auth data...');
    const usr = this.jwtService.parseUserFromToken();
    if (this.jwtService.checkAccessTokenExp() && usr) {
      console.log('Found valid access token');
      this.userService.changeCurrentUser(usr);
      this.userService.changeAuthStatus(true);
      this.chatService.startConnection();
    } else if (this.jwtService.refreshToken !== '') {
      console.log('Found valid refresh token');
      this.handleNewTokens(this.refresh());
    } else {
      this.userService.changeAuthStatus(false);
    }

    console.log(`Auth status: ${this.userService.getStatus()}`);
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<Tokens>(`${environment.apiUrl}/auth/login`,
      {email, password}).pipe(
      map((val: Tokens) => {
        if (val) {
          this.setAuth(val);
          return true;
        }
        return false;
      }));
  }

  public register(email: string, userName: string, password: string): Observable<boolean> {
    return this.httpClient.post<any>(environment.apiUrl + '/auth/register',
      {Email: email, Password: password, UserName: userName}, {observe: 'response'})
      .pipe(map(val => {
        if (val.ok) {
          this.login(email, password).subscribe();
          return true;
        }
        return false;
      }));
  }

  public logout(): void {
    this.chatService.terminateConnection();
    this.httpClient.post(`${environment.apiUrl}/auth/revoke`, {refreshToken: this.jwtService.refreshToken}).subscribe();
    this.jwtService.removeTokens();
    this.userService.removeUser();
    this.chatService.clear();
    this.router.navigate(['']);
  }

  public refresh(): Observable<Tokens | null> {
    return this.httpClient.post<Tokens>(`${environment.apiUrl}/auth/refresh`,
      {refreshToken: this.jwtService.refreshToken}).pipe(
      catchError(_ => {
        return of(null);
      })
    );
  }

  public handleNewTokens(tokens: Observable<Tokens | null>): void {
    tokens.subscribe(value => {
      if (value) {
        this.setAuth(value);
        this.chatService.startConnection();
      } else {
        this.userService.changeAuthStatus(false);
      }
    });
  }

  public setupRefreshTimer(): void {
    this.stopRefreshTimer();
    const timeout = this.jwtService.getAccessTokenExp() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.handleNewTokens(this.refresh()), timeout);
  }

  public stopRefreshTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  public setAuth(tokens: Tokens): void {
    this.jwtService.accessToken = tokens.accessToken;
    this.jwtService.refreshToken = tokens.refreshToken;
    const usr = this.jwtService.parseUserFromToken();
    if (usr) {
      this.userService.changeCurrentUser(usr);
      this.userService.changeAuthStatus(true);
      this.setupRefreshTimer();
      this.chatService.startConnection();
    } else {
      this.jwtService.removeTokens();
      this.userService.changeAuthStatus(false);
    }
  }
}
