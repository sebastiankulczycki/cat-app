import { Injectable, InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly _loaderVisibility: Subject<boolean> = new Subject<boolean>();
  private readonly _loaderVisibility$: Observable<boolean> =
    this._loaderVisibility.asObservable();

  public showLoader(): void {
    this._loaderVisibility.next(true);
  }

  public hideLoader(): void {
    this._loaderVisibility.next(false);
  }

  public get loaderVisibility$(): Observable<boolean> {
    return this._loaderVisibility$;
  }
}
