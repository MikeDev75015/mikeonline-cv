import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTagListComponent } from './item-tag-list.component';

describe('ItemTagListComponent', () => {
  let component: ItemTagListComponent;
  let fixture: ComponentFixture<ItemTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTagListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
