
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/']);
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.role === 'Admin') {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
