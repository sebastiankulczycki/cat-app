import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  private readonly _errorMessage: string = inject(MAT_DIALOG_DATA);

  protected get errorMessage(): string {
    return this._errorMessage;
  }
}
