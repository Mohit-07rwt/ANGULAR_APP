import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {

  const storage = inject(StorageService);
  const router = inject(Router);

  const token = storage.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};