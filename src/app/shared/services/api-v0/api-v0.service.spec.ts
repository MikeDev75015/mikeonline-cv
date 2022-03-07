import { TestBed } from '@angular/core/testing';
import { HttpClientService } from '../../../core/services/http-client/http-client.service';

import { ApiV0Service } from './api-v0.service';

describe('ApiV0Service', () => {
  let service: ApiV0Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClientService, useValue: {} },
      ]
    });
    service = TestBed.inject(ApiV0Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
