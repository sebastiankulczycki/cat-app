import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  filter,
  takeUntil,
  tap,
} from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  protected form!: FormGroup;

  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly formBuilder: NonNullableFormBuilder = inject(
    NonNullableFormBuilder
  );

  private readonly _destroy: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    this._createForm();

    this.user$
      .pipe(
        takeUntil(this._destroy),
        filter((user: IUser | null) => user !== null && user !== undefined),
        tap(() => {
          this.router.navigate(['..'], {
            relativeTo: this.route,
          });
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  protected onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.authService.loginUser({ ...this.form.getRawValue() });
    }
  }

  private _createForm(): void {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.formBuilder.control('', [Validators.required]),
    });
  }

  protected get email(): FormControl {
    return <FormControl>this.form.get('email');
  }

  protected get password(): FormControl {
    return <FormControl>this.form.get('password');
  }

  private get user$(): Observable<IUser | null> {
    return this.authService.user$;
  }
}
