import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.type';
import { HttpClientService } from '../http-client/http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * @ignore
   * @param httpClientService
   */
  constructor(
    private readonly httpClientService: HttpClientService,
  ) {
  }

  public getData<T>(path: ApiV1Path): Observable<T> {
    return this.httpClientService.get<T>(`/v1/${path}`);
  }
}
