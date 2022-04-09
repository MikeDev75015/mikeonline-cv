import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiV0Interceptor } from './api-v0/api-v0.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiV0Interceptor, multi: true },
];
