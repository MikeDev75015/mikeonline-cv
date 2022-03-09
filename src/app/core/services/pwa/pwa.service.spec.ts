import { TestBed } from '@angular/core/testing';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { AlertService } from '../../modules/alert/alert.service';

import { PwaService } from './pwa.service';

describe('PwaService', () => {
  let service: PwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        { provide: SwPush, useValue: {} },
        { provide: SwUpdate, useValue: {} },
        { provide: AlertService, useValue: {} },
      ],
    });
    service = TestBed.inject(PwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
