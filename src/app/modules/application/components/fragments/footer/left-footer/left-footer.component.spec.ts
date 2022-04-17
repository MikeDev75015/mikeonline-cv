import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { dataServiceMock } from '../../../../../../../../__mocks__/services/data-service.mock';
import { utilsServiceMock } from '../../../../../../../../__mocks__/services/utils-service.mock';
import { DataService, UtilsService } from '../../../../../../shared';

import { LeftFooterComponent } from './left-footer.component';

describe('LeftFooterComponent', () => {
  let component: LeftFooterComponent;
  let fixture: ComponentFixture<LeftFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [LeftFooterComponent],
      providers: [
        {
          provide: DataService,
          useValue: dataServiceMock,
        },
        {
          provide: UtilsService,
          useValue: utilsServiceMock,
        },
      ],
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
