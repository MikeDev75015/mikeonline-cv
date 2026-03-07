import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_WIDTH } from '../constants/input-wrapper.constant';

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    standalone: false
})
export class InputNumberComponent implements AfterViewInit {
  @ViewChild('inputNumberWrapped', { static: false }) inputNumber: InputText | undefined;

  @Input() inputWidth = DEFAULT_INPUT_WIDTH;

  @Input() inputHeight = DEFAULT_INPUT_HEIGHT;

  @Input() inlineClass?: string;

  @Input() min?: number;

  @Input() max?: number;

  @Input() step?: number;

  @Input() title?: string;

  @Input() name?: string;

  @Input() placeholder?: string;

  @Input() readonly = false;

  @Input() disabled = false;

  @Input() value: any = '';

  @Output() valueChange = new EventEmitter<any>();

  ngAfterViewInit(): void {
    if (this.inputNumber) {
      // @ts-ignore
      this.inputNumber.nativeElement.min = this.min || 0;
      // @ts-ignore
      this.inputNumber.nativeElement.max = this.max || 999;
      // @ts-ignore
      this.inputNumber.nativeElement.step = this.step || 1;
      // @ts-ignore
      this.inputNumber.nativeElement.name = this.name || '';
      // @ts-ignore
      this.inputNumber.nativeElement.title = this.title || '';
      // @ts-ignore
      this.inputNumber.nativeElement.placeholder = this.placeholder || '';
    }
  }

  public onValueChange(value: any): void {
    this.value = +value;
    this.valueChange.emit(this.value);
  }
}
