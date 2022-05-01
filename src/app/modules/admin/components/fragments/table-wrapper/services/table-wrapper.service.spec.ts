import { TestBed } from '@angular/core/testing';

import { TableWrapperService } from './table-wrapper.service';

describe('TableWrapperService', () => {
  let service: TableWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
