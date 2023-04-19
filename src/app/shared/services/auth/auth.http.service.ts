import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map } from 'rxjs';

import {
	IUser,
	IUserData,
	IUserLogin,
	IUsers,
} from '../../interfaces/user.interface';

import { ApiResponse } from '../../interfaces/api-response.interface';

@Injectable({
	providedIn: 'root',
})
export class HttpAuthService {
	constructor(private http: HttpClient) {}

	getUser(value: IUserLogin): Observable<IUser> {
		return this.http.get<ApiResponse<IUsers>>('assets/user.json').pipe(
			map((response) => {
				const user = <IUser>response.data.users.find((user) => {
					return (
						user.email === value.email && user.password === value.password
					);
				});
				return user;
			})
		);
	}
}
