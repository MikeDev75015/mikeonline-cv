import { TestBed } from '@angular/core/testing';

import { FormWrapperService } from './form-wrapper.service';

describe('FormWrapperService', () => {
  let service: FormWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
