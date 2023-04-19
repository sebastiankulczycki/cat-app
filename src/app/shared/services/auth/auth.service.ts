import { Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, delay, map, tap } from 'rxjs';

import { LoaderService } from '../loader.service';
import { ErrorDialogService } from '../error-dialog.service';
import { HttpAuthService } from './auth.http.service';
import { IUser, IUserLogin } from '../../interfaces/user.interface';

export const AUTH_SERVICE = new InjectionToken<string>('AUTH_SERVICE_TOKEN');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn: boolean = false;

  private _user$ = new BehaviorSubject<IUser | null>(null);

  get user$(): Observable<IUser | null> {
    return this._user$;
  }

  constructor(
    private httpService: HttpAuthService,
    private loaderService: LoaderService,
    private dialogService: ErrorDialogService,
    private router: Router
  ) {}

  findUser(userData: IUserLogin): Observable<IUser> {
    return this.httpService.getUser(userData).pipe(
      tap(() => {
        this.loaderService.showLoader();
      }),
      delay(2000),
      map((user) => {
        if (user) {
          const { username, email } = user;
          this.isLoggedIn = true;
          this.setUser(user);
          this.loaderService.hideLoader();

          return { username, email };
        } else {
          const error = new Error('User not found');
          this.loaderService.hideLoader();
          this.dialogService.openErrorDialog(error.message);
          throw error;
        }
      })
    );
  }

  private setUser(value: IUser): void {
    sessionStorage.setItem('user', 'true');
    this._user$.next(value);
  }

  loginUser(userData: IUserLogin): void {
    this.findUser(userData).subscribe();
  }

  logoutUser(): void {
    this.isLoggedIn = false;
    sessionStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  isUserLoggedIn(): boolean {
    if (this.isLoggedIn || sessionStorage.getItem('user')) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
