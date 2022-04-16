import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import UsersJsonFile from '../../../__mocks__/json-files/users.json';
import { IUser } from '../../interfaces/models/user.interface';

@Injectable()
export class ApiV1Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/v1/login')) {
      return this.handleAuthRequest(request);
    }

    return next.handle(request);
  }

  private handleAuthRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const userFound = UsersJsonFile.find((user) => (user.name === request.body.username && user.password === request.body.password));
    if (!userFound) {
      return throwError(() => new Error('User not found!'));
    }

    const jsonFile = {
      id: userFound.id,
      name: userFound.name,
      role: userFound.role,
    } as IUser;

    return of(new HttpResponse({ status: 200, body: jsonFile }));
  }
}
