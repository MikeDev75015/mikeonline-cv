import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownOption } from '../dropdown-wrapper/dropdown-wrapper.component';
import { InputWrapperType } from '../input-wrapper/input-wrapper.component';

export interface InputWrapperOptions {
  inputType: InputWrapperType;

  label: string;

  value?: any;

  /**
   * Textarea options
   */
  rows?: number;

  /**
   * Number options
   */
  min?: number;

  max?: number;

  step?: number;

  /**
   * Dropdown options
   */
  list?: DropdownOption[];

  stringList?: string[];

  scrollHeight?: string;
}

export interface FormFields extends InputWrapperOptions {
  name: string;
}

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
})
export class FormWrapperComponent implements OnInit {
  @Input() formFields: FormFields[] | undefined;

  @Input() formValue: any = {};

  @Output() formValueChange = new EventEmitter<any>();

  ngOnInit(): void {
    if (!this.formFields || !this.formFields.length) {
      throw new Error('Cannot initialize form, no valid config found!');
    }
  }

  public onValueChange(): void {
    this.formValueChange.emit(this.formValue);
  }
}
