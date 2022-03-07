import {TestBed} from '@angular/core/testing';
import { UtilsService } from '../../../shared/shared-index';

import {PdfCreatorService} from './pdf-creator.service';
import {MockService} from 'ng-mocks';

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
    const service: PdfCreatorService = TestBed.get(PdfCreatorService);
    expect(service).toBeTruthy();
  });
});
