import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { LoginComponent } from './login.component';

import { of } from 'rxjs';
import { SpinnerModule } from 'src/app/shared/components/spinner/spinner.module';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;

  const authServiceSpy: Partial<AuthService> = {
    loginUser: () => void 0,
    get user$() {
      return of(null);
    },
  };

  const mockUser = {
    username: 'Test',
    email: 'test@test.com',
  };

  beforeEach(() => {
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
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(loginComponent).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to parent route if user is logged in', () => {
      const userSpy: jasmine.Spy = spyOnProperty(
        authService,
        'user$',
        'get'
      ).and.returnValue(of(mockUser));

      fixture.detectChanges();

      loginComponent.ngOnInit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['..'], {
        relativeTo: routeSpy,
      });

      userSpy.calls.reset();
    });

    it('should not redirect if user is not logged in', () => {
      const userSpy: jasmine.Spy = spyOnProperty(
        authService,
        'user$',
        'get'
      ).and.returnValue(of(null));

      fixture.detectChanges();

      loginComponent.ngOnInit();

      expect(routerSpy.navigate).not.toHaveBeenCalled();

      userSpy.calls.reset();
    });
  });

  describe('onSubmit', () => {
    it('should raise required email error when email is empty', () => {
      loginComponent['password'].setValue('test');
      spyOn(loginComponent['form'], 'markAllAsTouched');

      loginComponent['onSubmit']();

      expect(loginComponent['form'].markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent['email'].hasError('required')).toBeTruthy();
    });

    it('should raise incorrect email error when email is incorrect', () => {
      loginComponent['email'].setValue('test');
      loginComponent['password'].setValue('test');
      spyOn(loginComponent['form'], 'markAllAsTouched');

      loginComponent['onSubmit']();

      expect(loginComponent['form'].markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent['email'].hasError('email')).toBeTruthy();
    });

    it('should raise required password error when password is empty', () => {
      loginComponent['email'].setValue('test@test.com');
      spyOn(loginComponent['form'], 'markAllAsTouched');

      loginComponent['onSubmit']();

      expect(loginComponent['form'].markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent['password'].hasError('required')).toBeTruthy();
    });

    it('should not call authService.loginUser when form is invalid', () => {
      spyOn(loginComponent['form'], 'markAllAsTouched');
      spyOn(authService, 'loginUser');

      loginComponent['onSubmit']();

      expect(loginComponent['form'].markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent['form'].invalid).toBeTrue();
      expect(authService.loginUser).not.toHaveBeenCalled();
    });

    it('should call authService.loginUser with form values when form is valid', () => {
      spyOn(authService, 'loginUser');
      spyOn(loginComponent['form'], 'markAllAsTouched');

      const email = 'test@test.com';
      const password = 'test123';
      loginComponent['form'].setValue({ email, password });

      loginComponent['onSubmit']();

      expect(loginComponent['form'].markAllAsTouched).toHaveBeenCalled();
      expect(loginComponent['form'].valid).toBeTrue();
      expect(authService.loginUser).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });
});
