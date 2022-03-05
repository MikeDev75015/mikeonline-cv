import {TestBed} from '@angular/core/testing';

import {ContactOpenCloseService} from './contact-open-close.service';

describe('ContactOpenCloseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactOpenCloseService = TestBed.get(ContactOpenCloseService);
    expect(service).toBeTruthy();
  });
});
