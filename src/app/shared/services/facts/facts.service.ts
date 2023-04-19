import { Injectable, InjectionToken } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  delay,
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

  private _fact$ = new BehaviorSubject<IFact>({ sentence: '' });

  get fact$(): Observable<IFact | null> {
    return this._fact$.asObservable();
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
        map((facts) => {
          return this.removeDuplicates([...this._facts$.value, ...facts]);
        }),
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
        this._facts$.next(facts);
      });
  }

  getFact(): void {
    this.loaderService.showLoader();
    this.httpService
      .getFact()
      .pipe(
        map((fact) => {
          console.log(fact);
          return fact;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            const err = new Error('No fact found');
            this.dialogService.openErrorDialog(err.message);
            throw err;
          }
          throw error;
        }),
        finalize(() => {
          this.loaderService.hideLoader();
        })
      )
      .subscribe((fact) => {
        console.log('subscribe fact', fact);
        this._fact$.next(fact);
      });
  }

  private removeDuplicates(facts: IFact[]): IFact[] {
    const uniqueFacts = Array.from(new Set(facts));
    return uniqueFacts;
  }
}
