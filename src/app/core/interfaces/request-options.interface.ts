import { HttpHeaders, HttpParams } from '@angular/common/http';

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
