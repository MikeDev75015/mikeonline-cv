import { HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';
import { StorageService } from '../../../../core/services/storage/storage.service';

import { AuthService, TokenPair } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const tokens: TokenPair = { accessToken: 'access-token', refreshToken: 'refresh-token' };
  const httpClientServiceMock = {
    post: vi.fn(() => of(tokens)),
    put: vi.fn(() => of(tokens)),
    get: vi.fn(() => of({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    });
    service = TestBed.inject(AuthService);
    service.removeTokens();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and read both tokens', () => {
    service.setTokens(tokens);

    expect(service.getAccessToken()).toBe('access-token');
    expect(service.getRefreshToken()).toBe('refresh-token');
  });

  it('should remove both tokens', () => {
    service.setTokens(tokens);
    service.removeTokens();

    expect(service.getAccessToken()).toBe('');
    expect(service.getRefreshToken()).toBe('');
    expect(StorageService.getItem('localStorage', STORAGE_KEYS.refreshToken)).toBeUndefined();
  });

  it('should return an empty string when no token is stored', () => {
    expect(service.getAccessToken()).toBe('');
    expect(service.getRefreshToken()).toBe('');
  });

  it('should send the refresh token as Bearer when refreshing', () => {
    service.setTokens(tokens);

    service.refreshAccessToken().subscribe();

    expect(httpClientServiceMock.put).toHaveBeenCalledTimes(1);
    const [endpoint, body, options] = httpClientServiceMock.put.mock.calls[0] as unknown as [string, unknown, { headers: HttpHeaders }];
    expect(endpoint).toBe('/auth/refresh-token');
    expect(body).toEqual({});
    expect(options.headers.get('Authorization')).toBe('Bearer refresh-token');
  });

  it('should post the credentials on login', () => {
    service.login({ username: 'admin', password: 'secret' }).subscribe((result) => {
      expect(result).toEqual(tokens);
    });

    expect(httpClientServiceMock.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'secret' });
  });
});
