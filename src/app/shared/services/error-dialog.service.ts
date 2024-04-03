import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  private readonly dialog: MatDialog = inject(MatDialog);

  public openErrorDialog(
    errorMessage: string
  ): MatDialogRef<ErrorDialogComponent> {
    return this.dialog.open(ErrorDialogComponent, {
      width: '400px',
      data: errorMessage,
    });
  }
}
