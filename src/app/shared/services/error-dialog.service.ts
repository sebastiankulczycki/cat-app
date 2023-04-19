import { Injectable, InjectionToken } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

export const DIALOG_SERVICE = new InjectionToken<string>(
  'DIALOG_SERVICE_TOKEN'
);

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  constructor(private dialog: MatDialog) {}

  openErrorDialog(errorMessage: string): MatDialogRef<ErrorDialogComponent> {
    return this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data: errorMessage,
    });
  }
}
