import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, delay, map, tap } from 'rxjs';

import { IUser, IUserLogin } from '../../interfaces/user.interface';
import { ErrorDialogService } from '../error-dialog.service';
import { LoaderService } from '../loader.service';
import { HttpAuthService } from './auth.http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn: boolean = false;

  private readonly router: Router = inject(Router);
  private readonly loaderService: LoaderService = inject(LoaderService);
  private readonly httpService: HttpAuthService = inject(HttpAuthService);
  private readonly dialogService: ErrorDialogService =
    inject(ErrorDialogService);

  private readonly _user = new BehaviorSubject<IUser | null>(null);
  private readonly _user$ = this._user.asObservable();

  public loginUser(userData: IUserLogin): void {
    this.findUser(userData).subscribe();
  }

  public logoutUser(): void {
    this._isLoggedIn = false;
    sessionStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  public isUserLoggedIn(): boolean {
    if (this._isLoggedIn || sessionStorage.getItem('user')) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  public findUser(userData: IUserLogin): Observable<IUser> {
    return this.httpService.getUser(userData).pipe(
      tap(() => {
        this.loaderService.showLoader();
      }),
      delay(2000),
      map((user) => {
        if (user) {
          const { username, email } = user;
          this._isLoggedIn = true;
          this._setUser(user);
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

  private _setUser(value: IUser): void {
    sessionStorage.setItem('user', 'true');
    this._user.next(value);
  }

  public get user$(): Observable<IUser | null> {
    return this._user$;
  }
}
