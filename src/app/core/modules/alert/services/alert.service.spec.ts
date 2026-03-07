import {TestBed} from '@angular/core/testing';

import {AlertService} from './alert.service';
import {MatDialogModule} from '@angular/material/dialog';

describe('AlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatDialogModule]
  }));

  it('should be created', () => {
    const service: AlertService = TestBed.inject(AlertService);
    expect(service).toBeTruthy();
  });
});
