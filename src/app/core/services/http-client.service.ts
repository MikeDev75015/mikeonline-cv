import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IRequestOptions } from '../interfaces/request-options.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  /**
   * Backend URL
   * @private
   */
  private readonly API_URL = environment.BACKEND_URL;

  /**
   * @ignore
   * @param httpClient
   */
  constructor(private readonly httpClient: HttpClient) { }

  /**
   * GET request
   * @param endpoint API endpoint
   * @param params option params object
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public get<T>(endpoint: string, params?: any | null, options?: IRequestOptions): Observable<T> {
    console.warn('HttpClientService get:', endpoint, params, options);
    options = options || {};
    options = Object.assign(options, {params});

    return this.httpClient.get<T>(this.API_URL + endpoint, options);
  }

  /**
   * GET blob request
   * @param endPoint API endpoint
   * @param params option params object
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public getBlob<T>(endPoint: string, params?: any | null, options?: IRequestOptions): Observable<T> {
    options = options || {};
    options = {...options, params};
    return this.httpClient.get<T>(this.API_URL + endPoint, Object.assign(options, {responseType: 'blob'}));
  }

  /**
   * POST request
   * @param endPoint API endpoint
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public post<T>(endPoint: string, body: any | null, options?: IRequestOptions): Observable<T> {
    return this.httpClient.post<T>(this.API_URL + endPoint, body, options);
  }

  /**
   * PUT request
   * @param endPoint API endpoint
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public put<T>(endPoint: string, body: any | null, options?: IRequestOptions): Observable<T> {
    return this.httpClient.put<T>(this.API_URL + endPoint, body, options);
  }

  /**
   * DELETE request
   * @param endPoint API endpoint
   * @param params option params object
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public delete<T>(endPoint: string, params?: any | null, options?: IRequestOptions): Observable<T> {
    options = options || {};
    options = Object.assign(options, {params});

    return this.httpClient.delete<T>(this.API_URL + endPoint, options);
  }
}
