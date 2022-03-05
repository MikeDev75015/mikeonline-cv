import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LeftFooterComponent} from './left-footer.component';
import {MockService} from 'ng-mocks';
import {UtilsService} from '../../../services/utils.service';
import {MockDataService} from '../../../services/mock-data.service';
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
          provide: MockDataService,
          useValue: MockService(MockDataService)
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
