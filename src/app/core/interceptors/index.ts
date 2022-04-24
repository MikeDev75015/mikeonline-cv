import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiV1Interceptor } from './api-v1/api-v1.interceptor';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HttpErrorInterceptor } from './http-error/http-error.interceptor';
import { HttpRequestInterceptor } from './http-request/http-request.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];

export const backendHttpInterceptor = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiV1Interceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
