import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFields } from './interfaces/form-fields.interface';

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

  public onValueChange(field: string, value: any): void {
    this.formValue[field] = value;
    this.formValueChange.emit(this.formValue);
  }
}
