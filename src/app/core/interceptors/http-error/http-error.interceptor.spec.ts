import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';

import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let authService: AuthService;
  let router: Router;
  const apiRequest = new HttpRequest('GET', `${environment.API_URL}/v1/skills`);
  const invalidToken = () => new HttpErrorResponse({
    status: 401,
    url: apiRequest.url,
    error: { message: 'INVALID_TOKEN' },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    authService.removeTokens();
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should refresh the pair once and retry the request with the new access token', async () => {
    authService.setTokens({ accessToken: 'expired', refreshToken: 'refresh-token' });
    const newTokens = { accessToken: 'fresh', refreshToken: 'rotated' };
    vi.spyOn(authService, 'refreshAccessToken').mockReturnValue(of(newTokens));
    const handle = vi.fn()
      .mockReturnValueOnce(throwError(() => invalidToken()))
      .mockReturnValueOnce(of(new HttpResponse({ status: 200, body: [] })));
    const next: HttpHandler = { handle };

    const response = await new Promise((resolve) => interceptor.intercept(apiRequest, next).subscribe(resolve));

    expect(response).toBeInstanceOf(HttpResponse);
    expect(handle).toHaveBeenCalledTimes(2);
    expect((handle.mock.calls[1][0] as HttpRequest<unknown>).headers.get('Authorization')).toBe('Bearer fresh');
    expect(authService.getAccessToken()).toBe('fresh');
    expect(authService.getRefreshToken()).toBe('rotated');
  });

  it('should clear the tokens and redirect to sign-in when the refresh fails', async () => {
    authService.setTokens({ accessToken: 'expired', refreshToken: 'revoked' });
    vi.spyOn(authService, 'refreshAccessToken').mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 401, error: { message: 'INVALID_USER' },
    })));
    const next: HttpHandler = { handle: vi.fn(() => throwError(() => invalidToken())) };

    const error = await new Promise((resolve) => interceptor.intercept(apiRequest, next).subscribe({ error: resolve }));

    expect(error).toEqual({ message: 'INVALID_USER' });
    expect(authService.getAccessToken()).toBe('');
    expect(authService.getRefreshToken()).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/sign-in']);
  });

  it('should not try to refresh without a stored refresh token', async () => {
    const refreshSpy = vi.spyOn(authService, 'refreshAccessToken');
    const next: HttpHandler = { handle: vi.fn(() => throwError(() => invalidToken())) };

    const error = await new Promise((resolve) => interceptor.intercept(apiRequest, next).subscribe({ error: resolve }));

    expect(refreshSpy).not.toHaveBeenCalled();
    expect(error).toEqual({ message: 'INVALID_TOKEN' });
  });

  it('should not try to refresh for the auth endpoints themselves', async () => {
    authService.setTokens({ accessToken: 'a', refreshToken: 'r' });
    const refreshSpy = vi.spyOn(authService, 'refreshAccessToken');
    const authRequest = new HttpRequest('PUT', `${environment.API_URL}/auth/refresh-token`, {});
    const next: HttpHandler = {
      handle: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 401, url: authRequest.url, error: { message: 'INVALID_TOKEN' } }))),
    };

    await new Promise((resolve) => interceptor.intercept(authRequest, next).subscribe({ error: resolve }));

    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('should redirect to the maintenance page when the API is unreachable', async () => {
    const next: HttpHandler = { handle: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 0 }))) };

    await new Promise((resolve) => interceptor.intercept(apiRequest, next).subscribe({ error: resolve }));

    expect(router.navigate).toHaveBeenCalledWith(['/maintenance']);
  });
});
