import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../../../core/interfaces/models/user.interface';
import { LoginPayloadRequest } from '../../../../core/interfaces/requests/login-payload.request';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClientService: HttpClientService,
  ) {}

  public login(payload: LoginPayloadRequest): Observable<IUser> {
    return this.httpClientService.post<IUser>('/v0/login', payload);
  }
}
