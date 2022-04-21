import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../services/error-message/error-message.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => this.handleResponseError(error)),
    );
  }

  private handleResponseError(error: HttpErrorResponse) {
    if (!error || error.status === 0) {
      console.debug('Serveur injoignable !');
      console.debug(error);
      return EMPTY;
    }

    return throwError(() => error);
  }
}
