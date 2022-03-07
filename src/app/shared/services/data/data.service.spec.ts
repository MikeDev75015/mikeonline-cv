import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: {} },
      ],
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
