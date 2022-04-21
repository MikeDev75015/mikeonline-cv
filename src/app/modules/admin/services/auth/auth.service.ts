import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiV1Path } from '../../../../core/interfaces/api/api-v1-path.enum';
import { UserV1 } from '../../../../core/interfaces/models/v1/user.interface';
import { LoginRequest } from '../../../../core/interfaces/requests/login.request';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private readonly httpClientService: HttpClientService,
  ) {
  }

  public setAuthHeader(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public login(payload: LoginRequest): Observable<{ accessToken: string; }> {
    console.debug('login:', payload);
    return this.httpClientService.post<{ accessToken: string; }>(`/${ApiV1Path.LOGIN}`, payload);
  }

  public logout(): Observable<void> {
    return this.httpClientService.put<void>(`/${ApiV1Path.LOGOUT}`, {});
  }

  public getUserAccount(): Observable<UserV1> {
    console.debug('getUserAccount');
    return this.httpClientService.get<UserV1>(`/${ApiV1Path.ACCOUNT}`);
  }
}
