import { TestBed } from '@angular/core/testing';
import { httpClientMock } from '../../../../../../__mocks__/services/http-client.mock';
import { HttpClientService } from '../../../../core/services/http-client/http-client.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClientService, useValue: httpClientMock },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
