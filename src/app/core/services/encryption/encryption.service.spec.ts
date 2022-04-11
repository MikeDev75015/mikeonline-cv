import { TestBed } from '@angular/core/testing';

import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  beforeEach(async () => await TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncryptionService = EncryptionService;
    expect(service).toBeTruthy();
  });
});
