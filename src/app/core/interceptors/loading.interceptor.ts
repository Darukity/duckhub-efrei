import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpLoadingService } from '../services/http-loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(HttpLoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
