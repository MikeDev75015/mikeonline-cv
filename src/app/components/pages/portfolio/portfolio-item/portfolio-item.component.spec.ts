import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { utilsServiceMock } from '../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../../../shared/shared-index';

import {PortfolioItemComponent} from './portfolio-item.component';

describe('PortfolioItemComponent', () => {
  let component: PortfolioItemComponent;
  let fixture: ComponentFixture<PortfolioItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioItemComponent ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
