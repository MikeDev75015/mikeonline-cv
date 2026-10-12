import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { HttpClientService } from '../http-client/http-client.service';

import { ApiService } from './api.service';

const httpClientServiceMock = { get: vi.fn() };

describe('ApiService', () => {
  let service: ApiService;
  let httpClientServiceGetSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    });

    service = TestBed.inject(ApiService);

    httpClientServiceGetSpy = vi.spyOn(httpClientServiceMock, 'get');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getData', () => {
    it('should call HttpClientService get method with the path passed as argument', fakeAsync(() => {
      service.getData<any>(ApiV1Path.INTERESTS);
      tick();

      expect(httpClientServiceGetSpy).toHaveBeenCalledTimes(1);
      expect(httpClientServiceGetSpy).toHaveBeenCalledWith('/v1/interests');
    }));
  });
});
