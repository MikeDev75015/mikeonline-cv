import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_WIDTH } from '../constants/input-wrapper.constant';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
})
export class InputCheckboxComponent implements OnInit, AfterViewInit {
  @ViewChild('inputCheckboxWrapped', { static: false }) inputCheckbox: Checkbox | undefined;

  @Input() inputWidth = DEFAULT_INPUT_WIDTH;

  @Input() inputHeight = DEFAULT_INPUT_HEIGHT;

  @Input() inlineClass = '';

  @Input() name?: string;

  @Input() readonly = false;

  @Input() disabled = false;

  @Input() label?: string;

  @Input() labelPlacement?: 'before' | 'after';

  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();

  ngOnInit(): void {
    if (typeof this.value !== 'boolean') {
      this.value = false;
    }
  }

  ngAfterViewInit(): void {
    if (this.inputCheckbox) {
      this.inputCheckbox.name = this.name || '';
    }

    this.onValueChange(this.value);
  }

  public onValueChange(value: any): void {
    this.value = value;
    console.debug('InputCheckboxComponent onValueChange', this.value);
    this.valueChange.emit(this.value);
  }
}
