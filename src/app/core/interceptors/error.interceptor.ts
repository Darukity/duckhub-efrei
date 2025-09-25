import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorService } from '../services/http-error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const ui = inject(HttpErrorService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg = err.error?.message || err.statusText || 'Unexpected error';
      ui.notify(msg, err.status, req.url);
      return throwError(() => err);
    })
  );
};
