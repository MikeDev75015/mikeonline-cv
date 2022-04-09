import { TestBed } from '@angular/core/testing';

import { ApiV0Interceptor } from './api-v0.interceptor';

describe('ApiV0Interceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiV0Interceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiV0Interceptor = TestBed.inject(ApiV0Interceptor);
    expect(interceptor).toBeTruthy();
  });
});
