import { TestBed } from '@angular/core/testing';

import { ApiV1Interceptor } from './api-v1.interceptor';

describe('ApiV1Interceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiV1Interceptor,
    ],
  }));

  it('should be created', () => {
    const interceptor: ApiV1Interceptor = TestBed.inject(ApiV1Interceptor);
    expect(interceptor).toBeTruthy();
  });
});
