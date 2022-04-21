import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';
import { STORAGE_KEYS } from '../../constants/storage-keys.constant';
import { StorageService } from '../../services/storage/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = StorageService.getItem<string>('localStorage', STORAGE_KEYS.accessToken);
    if (accessToken) {
      request = this.authService.setAuthHeader(request, accessToken);
    }

    return next.handle(request);
  }
}
