import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserV1 } from '../../../../core/interfaces/models/v1/user.interface';
import { LoginPayloadRequest } from '../../../../core/interfaces/requests/login-payload.request';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClientService: HttpClientService,
  ) {}

  public login(payload: LoginPayloadRequest): Observable<UserV1> {
    return this.httpClientService.post<UserV1>('/v1/login', payload);
  }
}
