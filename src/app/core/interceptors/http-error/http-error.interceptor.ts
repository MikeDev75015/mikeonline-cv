import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
        if (this.shouldRefreshToken(httpErrorResponse, request)) {
          return this.handleInvalidTokenResponse(request, next);
        }

        return this.handleResponseError(httpErrorResponse);
      }),
    );
  }

  /**
   * Refresh only once, for API calls made with an access token, never for the auth endpoints themselves.
   */
  private shouldRefreshToken(httpErrorResponse: HttpErrorResponse, request: HttpRequest<any>): boolean {
    const url = request.url || httpErrorResponse.url || '';
    const message = httpErrorResponse?.error?.message;

    return httpErrorResponse.status === 401
      && message === 'INVALID_TOKEN'
      && url.includes(environment.API_URL)
      && !url.includes('/auth/')
      && !!this.authService.getRefreshToken();
  }

  private handleInvalidTokenResponse(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshAccessToken().pipe(
      mergeMap((tokens) => {
        this.authService.setTokens(tokens);
        return next.handle(this.authService.setHeaderAuthorization(request, tokens.accessToken));
      }),
      catchError((refreshError: HttpErrorResponse) => {
        this.authService.removeTokens();
        this.router.navigate(['/admin/sign-in']).finally(() => undefined);
        return throwError(() => refreshError?.error ?? refreshError);
      }),
    );
  }

  private handleResponseError(httpErrorResponse: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (!httpErrorResponse || httpErrorResponse.status === 0) {
      this.redirectToMaintenancePage(httpErrorResponse);
    }

    const error = httpErrorResponse?.error ?? httpErrorResponse;

    if (error?.message === 'INVALID_USERNAME_OR_PASSWORD') {
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
