import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

import { MultiSelectWrapperComponent } from './multi-select-wrapper.component';

describe('MultiSelectWrapperComponent', () => {
  let component: MultiSelectWrapperComponent;
  let fixture: ComponentFixture<MultiSelectWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSelectWrapperComponent],
      imports: [
        MultiSelectModule,
        FormsModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectWrapperComponent);
    component = fixture.componentInstance;
    component.stringList = ['1'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
