import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_WIDTH } from '../constants/input-wrapper.constant';

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.component.html',
    standalone: false
})
export class InputTextComponent implements AfterViewInit {
  @ViewChild('inputTextWrapped', { static: false }) inputText: InputText | undefined;

  @Input() inputWidth = DEFAULT_INPUT_WIDTH;

  @Input() inputHeight = DEFAULT_INPUT_HEIGHT;

  @Input() inlineClass = '';

  @Input() title?: string;

  @Input() name?: string;

  @Input() placeholder?: string;

  @Input() readonly = false;

  @Input() disabled = false;

  @Input() value: any = '';

  @Output() valueChange = new EventEmitter<any>();

  ngAfterViewInit(): void {
    if (this.inputText) {
      // @ts-ignore
      this.inputText.nativeElement.name = this.name || '';
      // @ts-ignore
      this.inputText.nativeElement.title = this.title || '';
      // @ts-ignore
      this.inputText.nativeElement.placeholder = this.placeholder || '';
    }
  }

  public onValueChange(value: any): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
