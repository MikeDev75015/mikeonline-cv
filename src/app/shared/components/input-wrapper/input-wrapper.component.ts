import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputWrapperType } from '../../../modules/admin/interfaces/input-wrapper.type';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_TYPE, DEFAULT_INPUT_WIDTH } from './constants/input-wrapper.constant';
import { InputWrapperCheckboxOptions } from './interfaces/checkbox-options.interface';
import { InputWrapperNumberOptions } from './interfaces/number-options.interface';
import { InputWrapperTextareaOptions } from './interfaces/textarea-options.interface';

@Component({
    selector: 'app-input-wrapper',
    templateUrl: './input-wrapper.component.html',
    standalone: false
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

  @Input() adapter: ((data: any) => any) | undefined;

  @Input() generator: ((data: any) => any) | undefined;

  @Input() value: any = '';

  @Output() valueChange = new EventEmitter<any>();

  public inputValue: any = '';

  ngOnInit(): void {
    if (!this.inputType) {
      this.inputType = 'text';
    }

    this.initializeStyles();
    this.initializeOptions();

    this.inputValue = this.adapter ? this.adapter(this.value) : this.value;
  }

  public onValueChange(value: any): void {
    this.value = this.generator ? this.generator(value) : value;
    this.valueChange.emit(this.value);
  }

  private initializeStyles(): void {
    if (!this.inputWidth) {
      this.inputWidth = DEFAULT_INPUT_WIDTH;
    }

    if (!this.inputHeight) {
      this.inputHeight = DEFAULT_INPUT_HEIGHT;
    }

    if (!this.inlineClass) {
      this.inlineClass = '';
    }
  }

  private initializeOptions(): void {
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
}
