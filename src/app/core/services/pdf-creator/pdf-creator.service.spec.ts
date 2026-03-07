import { TestBed } from '@angular/core/testing';
import { MockService } from 'ng-mocks';
import { UtilsService } from '../../../shared';

import { PdfCreatorService } from './pdf-creator.service';

describe('PdfCreatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: UtilsService,
        useValue: MockService(UtilsService)
      }
    ]
  }));

  it('should be created', () => {
    const service: PdfCreatorService = TestBed.inject(PdfCreatorService);
    expect(service).toBeTruthy();
  });
});
