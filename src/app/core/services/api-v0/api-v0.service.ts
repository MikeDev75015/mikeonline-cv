import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiV0Path } from '../../interfaces/api/api-v0-path.type';
import { HttpClientService } from '../http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ApiV0Service {
  /**
   * @ignore
   * @param httpClientService
   */
  constructor(
    private readonly httpClientService: HttpClientService,
  ) {}

  public getData<T>(path: ApiV0Path): Observable<T> {
    return this.httpClientService.get<T>(`/v0/${path}`);
  }
}
