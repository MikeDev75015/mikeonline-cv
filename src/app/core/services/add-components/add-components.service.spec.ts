import {TestBed} from '@angular/core/testing';

import {AddComponentsService} from './add-components.service';

describe('AddComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AddComponentsService]
  }));

  it('should be created', () => {
    const service: AddComponentsService = TestBed.get(AddComponentsService);
    expect(service).toBeTruthy();
  });
});
