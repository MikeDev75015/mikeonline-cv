import { ComponentFixture, TestBed } from '@angular/core/testing';
import { utilsServiceMock } from '../../../../../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../../../../../shared';

import { ItemDetailComponent } from './item-detail.component';

describe('ItemDetailComponent', () => {
  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailComponent],
      imports: [],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
