import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { DataService, UtilsService } from '../../../../shared/shared-index';

import {LeftFooterComponent} from './left-footer.component';
import {MockService} from 'ng-mocks';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('LeftFooterComponent', () => {
  let component: LeftFooterComponent;
  let fixture: ComponentFixture<LeftFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ LeftFooterComponent ],
      providers: [
        {
          provide: DataService,
          useValue: MockService(DataService)
        },
        {
          provide: UtilsService,
          useValue: MockService(UtilsService)
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
