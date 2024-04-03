import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';

import { LoaderService } from './shared/services/loader.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { ErrorDialogService } from './shared/services/error-dialog.service';

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
  providers: [LoaderService, ErrorDialogService],
})
export class AppModule {}
