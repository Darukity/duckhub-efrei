import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  if (user && user.roles.includes('admin')) {
    return true;
  }

  // Si pas admin → redirige ailleurs (ex: /)
  return router.createUrlTree(['/']);
};