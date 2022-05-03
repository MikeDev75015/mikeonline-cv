import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormField } from './interfaces/form-field.interface';
import { FormWrapperService } from './services/form-wrapper.service';

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
})
export class FormWrapperComponent implements OnInit {
  @Input() formFields: FormField[] | undefined;

  @Input() displayFormButtons = false;

  @Input() isChildForm = false;

  @Input() formValues: any = {};

  @Output() formValuesChange = new EventEmitter<any>();

  @Input() isValidForm = false;

  @Output() isValidFormChange = new EventEmitter<boolean>();

  @Output() closeForm = new EventEmitter<any>();

  public isInitialized = false;

  private initialValues: any = {};

  constructor(
    private readonly formWrapperService: FormWrapperService,
  ) {
  }

  ngOnInit(): void {
    if (!this.formFields || !this.formFields.length) {
      throw new Error('Cannot initialize form, no valid config found!');
    }

    if (!this.formValues) {
      this.formValues = {};
    }

    this.initialValues = { ...this.formValues };
    if (!this.isChildForm) {
      this.formValues = this.formWrapperService.initializeFormValues(this.formFields, { ...this.formValues });
    }

    this.isInitialized = true;
  }

  public onCloseForm(): void {
    this.closeForm.emit();
  }

  public onSaveData(): void {
    this.checkFormValidity();
    if (!this.isValidForm) {
      return;
    }

    this.closeForm.emit(this.formValues);
  }

  public onAddElement(field: string): void {
    if (!this.formFields || !field) {
      throw new Error('Invalid state, cannot find form element!');
    }

    const formElement = this.formWrapperService.findFormElement(field, this.formFields);
    const newElement = this.formWrapperService.getNewElement(formElement.childFormFields as FormField[]);

    this.formValues[field].push(newElement);
    this.checkFormValidity();
  }

  public onRemoveElement(index: number, field: string): void {
    this.formValues[field].splice(index, 1);
    this.checkFormValidity();
  }

  public onValueChange(field: string, value: any): void {
    this.formValues[field] = value;
    this.checkFormValidity();
  }

  public onSubFormValueChange(field: string, value: any, index?: number): void {
    if (index !== undefined) {
      this.formValues[field][index] = value;
    } else {
      this.formValues[field] = value;
    }
    this.checkFormValidity(false);
  }

  private checkFormValidity(emit = true): void {
    // @ts-ignore
    this.isValidForm = this.formWrapperService.isValidFormValues(this.formFields, this.formValues);
    this.isValidFormChange.emit(this.isValidForm);
    if (this.isValidForm && emit) {
      this.formValuesChange.emit(this.formValues);
    }
  }
}
