import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form = this.formBuilder.group({
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.formBuilder.control('', [Validators.required]),
  });

  get email(): FormControl {
    return <FormControl>this.form.get('email');
  }

  get password(): FormControl {
    return <FormControl>this.form.get('password');
  }

  private user$ = this.authService.user$;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.user$
        .pipe(
          filter((user) => user !== null && user !== undefined),
          tap(() => {
            this.router.navigate(['..'], {
              relativeTo: this.route,
            });
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.authService.loginUser({ ...this.form.getRawValue() });
    }
  }
}
