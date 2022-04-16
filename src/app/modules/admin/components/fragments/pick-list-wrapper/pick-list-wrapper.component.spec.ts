import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickListWrapperComponent } from './pick-list-wrapper.component';

describe('PickListWrapperComponent', () => {
  let component: PickListWrapperComponent;
  let fixture: ComponentFixture<PickListWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickListWrapperComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
