import { TestBed } from '@angular/core/testing';

import { ApiV0Service } from './api-v0.service';

describe('ApiV0Service', () => {
  let service: ApiV0Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiV0Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
