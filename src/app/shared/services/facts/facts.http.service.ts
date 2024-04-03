import {
  HttpClient,
  HttpParams,
  HttpParamsOptions,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { ApiResponse } from '../../interfaces/api-response.interface';
import { IFact } from '../../interfaces/facts.interface';

export const API_URL = 'https://meowfacts.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class HttpFactsService {
  private readonly http: HttpClient = inject(HttpClient);

  public getFacts(count: number): Observable<IFact[]> {
    const paramsOptions: HttpParamsOptions = {
      fromObject: {
        count,
      },
    };

    const params = new HttpParams(paramsOptions);

    return this.http.get<ApiResponse<string[]>>(API_URL, { params }).pipe(
      map((response) => {
        return response.data.map((fact) => {
          return {
            sentence: fact,
          };
        });
      })
    );
  }

  public getFact(): Observable<IFact> {
    return this.http.get<ApiResponse<string[]>>(API_URL).pipe(
      map((response) => {
        return response.data.map((fact) => {
          return {
            sentence: fact,
          };
        })[0];
      })
    );
  }
}
