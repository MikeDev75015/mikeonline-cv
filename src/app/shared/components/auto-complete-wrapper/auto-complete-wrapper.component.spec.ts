import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CV_TYPE_DROPDOWN_LIST } from '../../../core/constants/common.constant';

import { AutoCompleteWrapperComponent } from './auto-complete-wrapper.component';

describe('AutoCompleteWrapperComponent', () => {
  let component: AutoCompleteWrapperComponent;
  let fixture: ComponentFixture<AutoCompleteWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoCompleteWrapperComponent],
      imports: [
        FormsModule,
        AutoCompleteModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteWrapperComponent);
    component = fixture.componentInstance;
    component.suggestions = CV_TYPE_DROPDOWN_LIST;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
