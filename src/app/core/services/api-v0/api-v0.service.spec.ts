import { TestBed } from '@angular/core/testing';
import { HttpClientService } from '../http-client/http-client.service';

import { ApiV0Service } from './api-v0.service';

const httpClientServiceMock = { get: jest.fn() };

describe('ApiV0Service', () => {
  let service: ApiV0Service;
  let httpClientServiceGetSpy: jest.SpyInstance<any, any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ]
    });

    service = TestBed.inject(ApiV0Service);

    httpClientServiceGetSpy = jest.spyOn(httpClientServiceMock, 'get');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getData', () => {
    it('should call HttpClientService get method with the path passed as argument', (done) => {
      service.getData<any>('interests');
      expect(httpClientServiceGetSpy).toHaveBeenCalledTimes(1);
      expect(httpClientServiceGetSpy).toHaveBeenCalledWith('/v0/interests');
      done();
    });
  });
});
