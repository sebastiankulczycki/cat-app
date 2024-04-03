import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { IUser, IUserLogin, IUsers } from '../../interfaces/user.interface';

import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpAuthService {
  private readonly http: HttpClient = inject(HttpClient);

  public getUser(value: IUserLogin): Observable<IUser> {
    return this.http.get<ApiResponse<IUsers>>('assets/user.json').pipe(
      map((response) => {
        const user = <IUser>response.data.users.find((user) => {
          return user.email === value.email && user.password === value.password;
        });
        return user;
      })
    );
  }
}
