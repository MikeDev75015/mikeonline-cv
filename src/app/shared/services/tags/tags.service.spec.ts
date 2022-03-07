import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: {} },
      ],
    });
    service = TestBed.inject(TagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
