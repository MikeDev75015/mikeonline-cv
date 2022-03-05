import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client/http-client.service';
import { ApiV0Path } from './models/api-v0-path.type';


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
