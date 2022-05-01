import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import UsersJsonFile from '../../../../../__mocks__/v1/json-files/users.json';
import { AuthPath } from '../../interfaces/api/auth-path.enum';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/auth/')) {
      const authPath = ('/auth/' + request.url.split('/auth/')[1]) as AuthPath;
      const token = request.headers.get('Authorization')?.split(' ')[1] || '';

      let body: any;
      let status = 200;
      switch (authPath) {
        case AuthPath.LOGIN:
          // @ts-ignore
          body = { accessToken: request.body.username === 'admin' ? '1234' : '5678' };
          break;
        case AuthPath.LOGOUT:
          body = { message: 'SUCCESS' };
          break;
        case AuthPath.ACCOUNT:
          const response = this.handleAccountRequest(token);
          body = response.body;
          status = response.status;
          break;
        default:
          body = { message: 'AUTH_INTERCEPTOR_ERROR', details: `Unknown auth path: ${authPath}!` };
      }

      return of(new HttpResponse({ status, body }));
    }

    return next.handle(request);
  }

  private handleAccountRequest(token: string): { status: number; body: any; } {
    const userFound = UsersJsonFile.find((user) => (user.id === token));
    if (!userFound) {
      return {
        status: 400,
        body: { message: 'AUTH_INTERCEPTOR_ERROR', details: 'INVALID_USERNAME_OR_PASSWORD' },
      };
    }

    return {
      status: 200,
      body: { id: userFound.id, name: userFound.name, role: userFound.role },
    };
  }
}
