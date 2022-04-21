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

  private handleResponseError(httpErrorResponse: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (!httpErrorResponse || httpErrorResponse.status === 0) {
      this.redirectToMaintenancePage(httpErrorResponse);
      // return EMPTY;
    }

    ErrorMessageService.sendMessage(httpErrorResponse.error.message);

    return throwError(() => httpErrorResponse);
  }

  private redirectToMaintenancePage(error: any): void {
    this.router.navigate(['/maintenance']).finally(() => {
      console.debug(error);
    });
  }
}
