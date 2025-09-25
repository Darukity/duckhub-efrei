import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('authGuard', () => {
  let router: Router;
  let authMock: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authMock = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authMock }
      ]
    });

    router = TestBed.inject(Router);
    spyOn(router, 'createUrlTree').and.callThrough();
  });

  it('allows when authenticated', () => {
    authMock.getCurrentUser.and.returnValue({
      id: '1', username: 'u', email: 'u@x', roles: ['user'], token: 't'
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/admin' } as unknown as RouterStateSnapshot)
    );

    expect(result).toBeTrue();
  });

  it('redirects when not authenticated', () => {
    authMock.getCurrentUser.and.returnValue(null);

    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/secret' } as unknown as RouterStateSnapshot)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/auth/login'],
      { queryParams: { returnUrl: '/secret' } }
    );
  });
});
