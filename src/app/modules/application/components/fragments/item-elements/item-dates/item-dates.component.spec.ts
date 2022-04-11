import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDatesComponent } from './item-dates.component';

describe('ItemDatesComponent', () => {
  let component: ItemDatesComponent;
  let fixture: ComponentFixture<ItemDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
