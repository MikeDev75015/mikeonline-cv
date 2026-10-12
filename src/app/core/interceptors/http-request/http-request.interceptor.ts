import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes(environment.API_URL) && !request.headers.has('Authorization')) {
      const accessToken = this.authService.getAccessToken();
      if (accessToken) {
        request = this.authService.setHeaderAuthorization(request, accessToken);
      }
    }

    return next.handle(request);
  }
}
