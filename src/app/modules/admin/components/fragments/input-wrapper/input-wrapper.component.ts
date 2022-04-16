import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputWrapperType } from '../../../interfaces/input-wrapper.type';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_TYPE, DEFAULT_INPUT_WIDTH } from './constants/input-wrapper.constant';
import { InputWrapperCheckboxOptions } from './interfaces/checkbox-options.interface';
import { InputWrapperNumberOptions } from './interfaces/number-options.interface';
import { InputWrapperTextareaOptions } from './interfaces/textarea-options.interface';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
})
export class InputWrapperComponent implements OnInit {
  @Input() inputWidth = DEFAULT_INPUT_WIDTH;

  @Input() inputHeight = DEFAULT_INPUT_HEIGHT;

  @Input() inputType: InputWrapperType = DEFAULT_INPUT_TYPE;

  @Input() inlineClass = '';

  @Input() name = '';

  @Input() placeholder = '';

  @Input() disabled = false;

  @Input() textareaOptions: InputWrapperTextareaOptions = {};

  @Input() numberOptions: InputWrapperNumberOptions = {};

  @Input() checkboxOptions: InputWrapperCheckboxOptions = {};

  @Input() value: any = '';

  @Output() valueChange = new EventEmitter<any>();

  ngOnInit(): void {
    if (!this.inputType) {
      this.inputType = 'text';
    }

    if (!this.inputWidth) {
      this.inputWidth = DEFAULT_INPUT_WIDTH;
    }

    if (!this.inputHeight) {
      this.inputHeight = DEFAULT_INPUT_HEIGHT;
    }

    if (!this.inlineClass) {
      this.inlineClass = '';
    }

    if (this.inputType === 'number' && !this.numberOptions) {
      this.numberOptions = {};
    }

    if (this.inputType === 'textarea' && !this.textareaOptions) {
      this.textareaOptions = {};
    }

    if (this.inputType === 'checkbox' && !this.checkboxOptions) {
      this.checkboxOptions = {};
    }
  }

  public onValueChange(value: any): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
