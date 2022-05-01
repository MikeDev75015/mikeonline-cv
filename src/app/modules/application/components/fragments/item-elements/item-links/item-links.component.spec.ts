import { ComponentFixture, TestBed } from '@angular/core/testing';
import { utilsServiceMock } from '../../../../../../../../__mocks__/services/utils-service.mock';
import { UtilsService } from '../../../../../../shared';

import { ItemLinksComponent } from './item-links.component';

describe('ItemLinksComponent', () => {
  let component: ItemLinksComponent;
  let fixture: ComponentFixture<ItemLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemLinksComponent],
      providers: [
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
