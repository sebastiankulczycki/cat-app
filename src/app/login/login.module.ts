import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { ErrorDialogModule } from '../shared/components/error-dialog/error-dialog.module';
import { AuthService } from '../shared/services/auth/auth.service';
import { HttpAuthService } from '../shared/services/auth/auth.http.service';

import { LoginRoutingModule } from './login.routing.module';
import { LoginComponent } from './components/login.component';
import { SpinnerModule } from '../shared/components/spinner/spinner.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ErrorDialogModule,
    SpinnerModule,
  ],
  providers: [AuthService, HttpAuthService],
})
export class LoginModule {}
