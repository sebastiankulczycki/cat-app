import { Injectable, InjectionToken } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  delay,
  distinct,
  finalize,
  map,
  tap,
} from 'rxjs';
import { HttpFactsService } from './facts.http.service';
import { LoaderService } from '../loader.service';
import { IFact } from '../../interfaces/facts.interface';
import { ErrorDialogService } from '../error-dialog.service';
import { HttpErrorResponse } from '@angular/common/http';

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
        tap(() => {
          this.loaderService.showLoader();
        }),
        delay(2000),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            const err = new Error('No facts found');
            this.dialogService.openErrorDialog(err.message);
            throw err;
          }
          throw error;
        }),

        finalize(() => {
          this.loaderService.hideLoader();
        })
      )
      .subscribe((facts) => {
        const newFacts = facts.filter(
          (fact) =>
            !this._facts$.value.some((f) => f.sentence === fact.sentence)
        );
        this._facts$.next([...this._facts$.value, ...newFacts]);
      });
  }
}
