import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { LoginComponent } from './login.component';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SpinnerModule } from 'src/app/shared/components/spinner/spinner.module';
import { BehaviorSubject, of } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/user.interface';

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      ['loginUser'],
      ['user$']
    );
    authServiceSpy['_user$'] = new BehaviorSubject<IUser | null>(null);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeSpy = jasmine.createSpyObj('ActivatedRoute', {
      snapshot: {
        parent: {
          url: [{ path: 'parent' }],
        },
      },
    });

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        SpinnerModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
  });

  it('should create', () => {
    expect(loginComponent).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const mockUser = {
      username: 'Test',
      email: 'test@test.com',
    };

    beforeEach(() => {
      loginComponent['user$'] = authServiceSpy['_user$'].asObservable();
      loginComponent.ngOnInit();
    });

    it('should redirect to parent route if user is logged in', () => {
      authServiceSpy['_user$'].next(mockUser);

      loginComponent['user$'].subscribe((user) => {
        expect(user).toEqual(mockUser);
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['..'], {
        relativeTo: routeSpy,
      });
    });

    it('should not redirect if user is not logged in', () => {
      authServiceSpy['_user$'].next(null);

      loginComponent['user$'].subscribe((user) => {
        expect(user).toEqual(null);
      });

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe all subscriptions on destroy', () => {
      spyOn(loginComponent['subscriptions'], 'unsubscribe');

      loginComponent.ngOnDestroy();

      expect(loginComponent['subscriptions'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should raise required email error when email is empty', () => {
      loginComponent.password.setValue('test');
      spyOn(loginComponent.form, 'markAllAsTouched');

      loginComponent.onSubmit();

      expect(loginComponent.form.markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent.email.hasError('required')).toBeTruthy();
    });

    it('should raise incorrect email error when email is incorrect', () => {
      loginComponent.email.setValue('test');
      loginComponent.password.setValue('test');
      spyOn(loginComponent.form, 'markAllAsTouched');

      loginComponent.onSubmit();

      expect(loginComponent.form.markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent.email.hasError('email')).toBeTruthy();
    });

    it('should raise required password error when password is empty', () => {
      loginComponent.email.setValue('test@test.com');
      spyOn(loginComponent.form, 'markAllAsTouched');

      loginComponent.onSubmit();

      expect(loginComponent.form.markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent.password.hasError('required')).toBeTruthy();
    });

    it('should not call authService.loginUser when form is invalid', () => {
      spyOn(loginComponent.form, 'markAllAsTouched');

      loginComponent.onSubmit();

      expect(loginComponent.form.markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent.form.invalid).toBeTrue();
      expect(authServiceSpy.loginUser).not.toHaveBeenCalled();
    });

    it('should call authService.loginUser with form values when form is valid', () => {
      const email = 'test@test.com';
      const password = 'test123';
      loginComponent.form.setValue({ email, password });

      spyOn(loginComponent.form, 'markAllAsTouched');

      loginComponent.onSubmit();

      expect(loginComponent.form.markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent.form.valid).toBeTrue();
      expect(authServiceSpy.loginUser).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });
});
