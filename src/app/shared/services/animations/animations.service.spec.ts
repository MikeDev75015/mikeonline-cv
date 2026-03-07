import { TestBed } from '@angular/core/testing';
import { utilsServiceMock } from '../../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../index';

import { AnimationsService } from './animations.service';

describe('AnimationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: UtilsService, useValue: utilsServiceMock },
    ]
  }));

  it('should be created', () => {
    const service: AnimationsService = TestBed.inject(AnimationsService);
    expect(service).toBeTruthy();
  });
});
