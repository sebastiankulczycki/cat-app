import { Injectable, InjectionToken } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  catchError,
  delay,
  finalize,
  of,
  tap,
} from 'rxjs';

import { IFact } from '../../interfaces/facts.interface';
import { HttpFactsService } from './facts.http.service';
import { LoaderService } from '../loader.service';
import { ErrorDialogService } from '../error-dialog.service';

export const FACTS_SERVICE = new InjectionToken<string>('FACTS_SERVICE_TOKEN');

@Injectable({
  providedIn: 'root',
})
export class FactsService {
  private _facts$ = new BehaviorSubject<IFact[]>([]);

  get facts$(): Observable<IFact[]> {
    return this._facts$.asObservable();
  }

  constructor(
    private httpService: HttpFactsService,
    private loaderService: LoaderService,
    private dialogService: ErrorDialogService
  ) {}

  getFacts(count: number): void {
    this.httpService
      .getFacts(count)
      .pipe(
        tap((facts) => {
          this.loaderService.showLoader();
          const removedDuplicates = [...this._facts$.value, ...facts].filter(
            (fact, index, self) =>
              index === self.findIndex((f) => f.sentence === fact.sentence)
          );
          this._facts$.next(removedDuplicates);
        }),
        delay(2000),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            const err = new Error('No facts found');
            this.dialogService.openErrorDialog(err.message);
            return of([]);
          }
          throw error;
        }),

        finalize(() => {
          this.loaderService.hideLoader();
        })
      )
      .subscribe();
  }
}
