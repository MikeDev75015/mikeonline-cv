import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../environments/environment';

/**
 * Interface representing Http request options types
 */
export interface IRequestOptions {
  /**
   * Outgoing headers for this request.
   */
  headers?: HttpHeaders;

  /**
   * The Http method returns (by default body).
   * Other values: response (returns the entire response), body (returns only the body), events (return the response
   * with events)
   */
  observe?: 'body';

  /**
   * Outgoing URL parameters.
   */
  params?: HttpParams;

  /**
   * Whether this request should be made in a way that exposes progress events.
   */
  reportProgress?: boolean;

  /**
   * The expected response type of the server.
   * By default, the body of the response is parsed as JSON. If you want any other type, then you need to specify
   * explicitly. Other values: arraybuffer, blob, json, text
   */
  responseType?: 'json';

  /**
   * Whether this request should be sent with outgoing credentials (cookies).
   */
  withCredentials?: boolean;

  /**
   * The request body, or null if one isn't set.
   */
  body?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  /**
   * Backend URL
   * @private
   */
  private readonly API_URL = environment.API_URL;

  /**
   * @ignore
   * @param httpClient
   */
  constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  /**
   * GET request
   * @param endpoint API endpoint
   * @param params option params object
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public get<T>(endpoint: string, params?: { [key: string]: any; }, options: IRequestOptions = {}): Observable<T> {
    if (params) {
      options = Object.assign(options, { params });
    }

    return this.httpClient.get<T>(this.API_URL + endpoint, options);
  }

  /**
   * POST request
   * @param endPoint API endpoint
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public post<T>(endPoint: string, body: { [key: string]: any; }, options: IRequestOptions = {}): Observable<T> {
    return this.httpClient.post<T>(this.API_URL + endPoint, body, options);
  }

  /**
   * PUT request
   * @param endPoint API endpoint
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public put<T>(endPoint: string, body: { [key: string]: any; }, options: IRequestOptions = {}): Observable<T> {
    return this.httpClient.put<T>(this.API_URL + endPoint, body, options);
  }

  /**
   * DELETE request
   * @param endPoint API endpoint
   * @param params option params object
   * @param options options of the request like headers, body, etc.
   * @returns Observable
   */
  public delete<T>(endPoint: string, params?: { [key: string]: any; }, options: IRequestOptions = {}): Observable<T> {
    if (params) {
      options = Object.assign(options, { params });
    }

    return this.httpClient.delete<T>(this.API_URL + endPoint, options);
  }
}
