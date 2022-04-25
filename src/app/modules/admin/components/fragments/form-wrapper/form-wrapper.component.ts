import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormWrapperService } from '../table-wrapper/services/form/form-wrapper.service';
import { FormField } from './interfaces/form-field.interface';

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
    this.closeForm.emit(this.formValues);
  }

  public onAddElement(field: string, actualValue: any[]): void {
    if (!this.formFields || !field) {
      throw new Error('Invalid state, cannot find form element!');
    }

    const formElement = this.formWrapperService.findFormElement(field, this.formFields);
    const newElement = this.formWrapperService.getNewElement(formElement.childFormFields as FormField[]);

    actualValue.push(newElement);
  }

  public onRemoveElement(index: number, actualValue: any[]): void {
    actualValue.splice(index, 1);
  }

  public onValueChange(field: string, value: any): void {
    this.formValues[field] = value;
    this.formValuesChange.emit(this.formValues);
  }

  public onSubFormValueChange(field: string, value: any, index?: number): void {
    if (index !== undefined) {
      this.formValues[field][index] = value;
    } else {
      this.formValues[field] = value;
    }
  }
}
