import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ErrorDialogComponent } from './error-dialog.component';
import { ErrorDialogService } from '../../services/error-dialog.service';

@NgModule({
	declarations: [ErrorDialogComponent],
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	providers: [ErrorDialogService],
})
export class ErrorDialogModule {}
