import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { AuthPath } from '../../../../core/interfaces/api/auth-path.enum';
import { UserV1 } from '../../../../core/interfaces/models/v1/user.interface';
import { LoginRequest } from '../../../../core/interfaces/requests/login.request';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';
import { StorageService } from '../../../../core/services/storage/storage.service';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private readonly httpClientService: HttpClientService,
  ) {
  }

  public setTokens({ accessToken, refreshToken }: TokenPair): void {
    this.setAccessToken(accessToken);
    StorageService.setItem('localStorage', STORAGE_KEYS.refreshToken, refreshToken);
  }

  public setAccessToken(accessToken: string) {
    StorageService.setItem('localStorage', STORAGE_KEYS.accessToken, accessToken);
  }

  public getAccessToken(): string {
    return AuthService.readToken(STORAGE_KEYS.accessToken);
  }

  public getRefreshToken(): string {
    return AuthService.readToken(STORAGE_KEYS.refreshToken);
  }

  public removeAccessToken(): void {
    StorageService.removeItem('localStorage', STORAGE_KEYS.accessToken);
  }

  public removeTokens(): void {
    this.removeAccessToken();
    StorageService.removeItem('localStorage', STORAGE_KEYS.refreshToken);
  }

  public setHeaderAuthorization(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public login(payload: LoginRequest): Observable<TokenPair> {
    return this.httpClientService.post<TokenPair>(`/${AuthPath.LOGIN}`, payload);
  }

  public logout(): Observable<void> {
    return this.httpClientService.put<void>(`/${AuthPath.LOGOUT}`, {});
  }

  public getUserAccount(): Observable<UserV1> {
    return this.httpClientService.get<UserV1>(`/${AuthPath.ACCOUNT}`);
  }

  /**
   * Rotates the token pair. The refresh token is sent as Bearer; the HttpRequestInterceptor
   * leaves an existing Authorization header untouched.
   */
  public refreshAccessToken(): Observable<TokenPair> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.getRefreshToken()}` });
    return this.httpClientService.put<TokenPair>(`/${AuthPath.REFRESH_TOKEN}`, {}, { headers });
  }

  private static readToken(key: string): string {
    const token = StorageService.getItem<any>('localStorage', key);

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
}
