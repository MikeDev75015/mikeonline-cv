import {TestBed} from '@angular/core/testing';
import { AlertModule } from '../../../modules/alert/alert.module';

import {UtilsService} from './utils.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('UtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      AlertModule
    ]
  }));

  it('should be created', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service).toBeTruthy();
  });
});
