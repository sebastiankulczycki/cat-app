import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

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
import { ErrorDialogService } from '../error-dialog.service';
import { LoaderService } from '../loader.service';
import { HttpFactsService } from './facts.http.service';

@Injectable({
  providedIn: 'root',
})
export class FactsService {
  private readonly loaderService: LoaderService = inject(LoaderService);
  private readonly httpService: HttpFactsService = inject(HttpFactsService);
  private readonly dialogService: ErrorDialogService =
    inject(ErrorDialogService);

  private readonly _facts: BehaviorSubject<IFact[]> = new BehaviorSubject<
    IFact[]
  >([]);
  private readonly _facts$: Observable<IFact[]> = this._facts.asObservable();

  public getFacts(count: number): void {
    this.httpService
      .getFacts(count)
      .pipe(
        tap((facts) => {
          this.loaderService.showLoader();
          const removedDuplicates = [...this._facts.value, ...facts].filter(
            (fact, index, self) =>
              index === self.findIndex((f) => f.sentence === fact.sentence)
          );
          this._facts.next(removedDuplicates);
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

  public get facts$(): Observable<IFact[]> {
    return this._facts$;
  }
}
