import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT } from '../dropdown-wrapper/constants/dropdown-wrapper.constant';
import { DropdownOption } from '../dropdown-wrapper/interfaces/dropdown-option.interface';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_WIDTH } from '../input-wrapper/constants/input-wrapper.constant';

@Component({
  selector: 'app-auto-complete-wrapper',
  templateUrl: './auto-complete-wrapper.component.html',
})
export class AutoCompleteWrapperComponent implements OnInit {
  @Input() scrollHeight = DEFAULT_DROPDOWN_WRAPPER_SCROLL_HEIGHT;

  @Input() inputWidth = DEFAULT_INPUT_WIDTH;

  @Input() inputHeight = DEFAULT_INPUT_HEIGHT;

  @Input() inlineStyle: { [key: string]: any } = {};

  @Input() inlineClass = '';

  @Input() name = '';

  @Input() placeholder = '';

  @Input() disabled = false;

  @Input() dropdown = false;

  @Input() suggestions: DropdownOption[] = [];

  @Input() value: any = '';

  @Output() valueChange = new EventEmitter<any>();

  public inputValue: DropdownOption | undefined;

  public suggestionList: DropdownOption[] = [];

  public results: DropdownOption[] = [];

  public appendTo = 'body';

  ngOnInit(): void {
    if (!this.suggestions || !this.suggestions.length) {
      throw new Error('Invalid auto complete configuration!');
    }

    this.suggestionList = this.suggestions.filter((suggest) => !!suggest);
    if (this.value) {
      let option = this.suggestionList.find((suggest) => suggest.label === this.value);
      if (!option) {
        option = { label: this.value, value: this.value.toLowerCase() };
        this.suggestionList.unshift(option);
      }
      this.inputValue = option;
    }
  }

  public onComplete(event: { query: string }): void {
    if (!event.query) {
      this.results = [];
    }
    this.results = this.suggestionList.filter((option) => {
      return typeof option.value === 'string' && option.value.includes(event.query.toLowerCase());
    });
  }

  public onValueChange(value: any): void {
    if (!value) {
      this.value = '';
    } else {
      this.value = typeof value === 'object' ? value.label : value;
    }
    this.valueChange.emit(this.value);
  }
}
