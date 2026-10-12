import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';

import { HttpRequestInterceptor } from './http-request.interceptor';

describe('HttpRequestInterceptor', () => {
  let interceptor: HttpRequestInterceptor;
  let authService: AuthService;
  const next: HttpHandler = { handle: vi.fn((request) => of(request as any)) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpRequestInterceptor,
      ],
      imports: [
        HttpClientTestingModule,
      ],
    });
    interceptor = TestBed.inject(HttpRequestInterceptor);
    authService = TestBed.inject(AuthService);
    authService.removeTokens();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add the access token to API requests', () => {
    authService.setTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });

    interceptor.intercept(new HttpRequest('GET', `${environment.API_URL}/v1/skills`), next);

    const forwarded = (next.handle as any).mock.calls[0][0] as HttpRequest<unknown>;
    expect(forwarded.headers.get('Authorization')).toBe('Bearer access-token');
  });

  it('should keep an Authorization header already set by the caller (refresh token flow)', () => {
    authService.setTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    const request = new HttpRequest('PUT', `${environment.API_URL}/auth/refresh-token`, {}, {
      headers: new HttpHeaders({ Authorization: 'Bearer refresh-token' }),
    });

    interceptor.intercept(request, next);

    const forwarded = (next.handle as any).mock.calls[0][0] as HttpRequest<unknown>;
    expect(forwarded.headers.get('Authorization')).toBe('Bearer refresh-token');
  });

  it('should not touch requests outside the API', () => {
    authService.setTokens({ accessToken: 'access-token', refreshToken: 'refresh-token' });

    interceptor.intercept(new HttpRequest('GET', 'https://example.com/assets/i18n/fr.json'), next);

    const forwarded = (next.handle as any).mock.calls[0][0] as HttpRequest<unknown>;
    expect(forwarded.headers.has('Authorization')).toBe(false);
  });
});
