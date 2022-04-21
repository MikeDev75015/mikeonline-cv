import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectWrapperComponent } from './multi-select-wrapper.component';

describe('MultiSelectWrapperComponent', () => {
  let component: MultiSelectWrapperComponent;
  let fixture: ComponentFixture<MultiSelectWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectWrapperComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
