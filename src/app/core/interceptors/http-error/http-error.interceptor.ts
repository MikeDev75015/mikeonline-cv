import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';
import { ErrorMessageService } from '../../services/error-message/error-message.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const { error, url } = httpErrorResponse;
        // @ts-ignore
        if (error.message === 'INVALID_TOKEN' && url.includes('/v1/')) {
          return this.handleInvalidTokenResponse(request, next);
        }

        return this.handleResponseError(httpErrorResponse);
      }),
    );
  }

  private handleInvalidTokenResponse(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return this.authService.refreshAccessToken().pipe(
      mergeMap(({ accessToken }) => {
        this.authService.setAccessToken(accessToken);
        return next.handle(request);
      }),
    );
  }

  private handleResponseError(httpErrorResponse: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (!httpErrorResponse || httpErrorResponse.status === 0) {
      this.redirectToMaintenancePage(httpErrorResponse);
    }

    const { error } = httpErrorResponse;

    if (error.message === 'INVALID_USERNAME_OR_PASSWORD') {
      ErrorMessageService.sendMessage(error.message);
    }

    return throwError(() => error);
  }

  private redirectToMaintenancePage(error: any): void {
    this.router.navigate(['/maintenance']).finally(() => {
      console.debug(error);
    });
  }
}
