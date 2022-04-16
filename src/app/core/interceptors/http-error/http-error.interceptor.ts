import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => this.handleResponseError(error)),
    );
  }

  private handleResponseError(error: HttpErrorResponse) {
    if (!error || error.status === 0) {
      console.warn('Serveur injoignable !');
      console.debug(error);
      return EMPTY;
    }

    return throwError(() => error);
  }
}
