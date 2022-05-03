import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../modules/admin/constants/common-formFields.config';

import { FormWrapperComponent } from './form-wrapper.component';

describe('FormWrapperComponent', () => {
  let component: FormWrapperComponent;
  let fixture: ComponentFixture<FormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FormWrapperComponent,
        MockComponent({
          selector: 'app-input-wrapper',
          inputs: [
            'value', 'disabled', 'name', 'placeholder', 'checkboxOptions', 'inlineClass', 'inputType', 'numberOptions',
            'textareaOptions',
          ],
        }),
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWrapperComponent);
    component = fixture.componentInstance;
    component.formFields = DEFAULT_FORM_FIELDS_CONFIG['contact'].childFormFields;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
