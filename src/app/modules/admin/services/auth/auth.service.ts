import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { AuthPath } from '../../../../core/interfaces/api/auth-path.enum';
import { UserV1 } from '../../../../core/interfaces/models/v1/user.interface';
import { LoginRequest } from '../../../../core/interfaces/requests/login.request';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';
import { StorageService } from '../../../../core/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private readonly httpClientService: HttpClientService,
  ) {
  }

  public setAccessToken(accessToken: string) {
    StorageService.setItem('localStorage', STORAGE_KEYS.accessToken, accessToken);
  }

  public getAccessToken(): string {
    const token = StorageService.getItem<any>('localStorage', STORAGE_KEYS.accessToken);

    if (!token) {
      return '';
    }

    if (typeof token === 'string') {
      return token;
    }

    if (typeof token === 'object' && typeof token.value === 'string') {
      return token.value;
    }

    return '';
  }

  public removeAccessToken(): void {
    StorageService.removeItem('localStorage', STORAGE_KEYS.accessToken);
  }

  public setHeaderAuthorization(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public login(payload: LoginRequest): Observable<{ accessToken: string; }> {
    return this.httpClientService.post<{ accessToken: string; }>(`/${AuthPath.LOGIN}`, payload);
  }

  public logout(): Observable<void> {
    return this.httpClientService.put<void>(`/${AuthPath.LOGOUT}`, {});
  }

  public getUserAccount(): Observable<UserV1> {
    return this.httpClientService.get<UserV1>(`/${AuthPath.ACCOUNT}`);
  }

  public refreshAccessToken(): Observable<{ accessToken: string; }> {
    return this.httpClientService.put<{ accessToken: string; }>(`/${AuthPath.REFRESH_TOKEN}`, {});
  }
}
