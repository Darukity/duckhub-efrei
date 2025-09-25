import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

const USERS_KEY = 'auth_users';
const CURRENT_KEY = 'auth_user';

describe('AuthService', () => {
  let svc: AuthService;

  beforeEach(() => {
    // reset storage between tests
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(CURRENT_KEY);

    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    // IMPORTANT: get the service from DI (effect() needs injection context)
    svc = TestBed.inject(AuthService);
  });

  it('should seed default users on first run', () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
    expect(users.length).toBeGreaterThan(0);
    expect(users.some((u: any) => u.username === 'admin')).toBeTrue();
  });

  it('should login default admin user', () => {
    const ok = svc.login('admin', 'admin123');
    expect(ok).toBeTrue();
    expect(svc.isAuthenticated()).toBeTrue();
    expect(svc.isAdmin()).toBeTrue();
  });

  it('should register then login the new user', () => {
    const registered = svc.register('john', 'john@x.dev', 'secret123');
    expect(registered).toBeTrue();
    expect(svc.isAuthenticated()).toBeTrue();
    expect(svc.getCurrentUser()?.username).toBe('john');
  });

  it('should logout', () => {
    svc.login('admin', 'admin123');
    svc.logout();
    expect(svc.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem(CURRENT_KEY)).toBeNull();
  });
});
