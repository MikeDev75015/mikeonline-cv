import { ComponentFixture, TestBed } from '@angular/core/testing';
import { utilsServiceMock } from '../../../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../../../../../shared/services/utils/utils.service';

import { ItemOpenCloseButtonsComponent } from './item-open-close-buttons.component';

describe('ItemOpenCloseButtonsComponent', () => {
  let component: ItemOpenCloseButtonsComponent;
  let fixture: ComponentFixture<ItemOpenCloseButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemOpenCloseButtonsComponent ],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOpenCloseButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
