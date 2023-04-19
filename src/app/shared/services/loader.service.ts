import { Injectable, InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const LOADER_SERVICE = new InjectionToken<string>(
  'LOADER_SERVICE_TOKEN'
);

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loaderVisibility$ = new Subject<boolean>();

  get loaderVisibility$(): Observable<boolean> {
    return this._loaderVisibility$.asObservable();
  }

  constructor() {}

  showLoader(): void {
    this._loaderVisibility$.next(true);
  }

  hideLoader(): void {
    this._loaderVisibility$.next(false);
  }
}
