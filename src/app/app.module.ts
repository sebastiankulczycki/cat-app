import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import {
  LOADER_SERVICE,
  LoaderService,
} from './shared/services/loader.service';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import {
  DIALOG_SERVICE,
  ErrorDialogService,
} from './shared/services/error-dialog.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LOADER_SERVICE, useValue: LoaderService },
    { provide: DIALOG_SERVICE, useValue: ErrorDialogService },
  ],
})
export class AppModule {}
