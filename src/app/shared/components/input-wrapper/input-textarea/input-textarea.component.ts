import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Textarea } from 'primeng/textarea';
import { DEFAULT_INPUT_WIDTH, DEFAULT_TEXTAREA_ROWS } from '../constants/input-wrapper.constant';

@Component({
    selector: 'app-input-textarea',
    templateUrl: './input-textarea.component.html',
    standalone: false
})
export class InputTextareaComponent {
  @ViewChild('inputTextareaWrapped', { static: false }) inputTextarea: Textarea | undefined;

  @Input() inputWidth = DEFAULT_INPUT_WIDTH;

  @Input() inlineClass?: string;

  @Input() rows?: number;

  @Input() title?: string;

  @Input() name?: string;

  @Input() placeholder?: string;

  @Input() disabled = false;

  @Input() value: any = '';

  @Output() valueChange = new EventEmitter<any>();

  ngAfterViewInit(): void {
    if (this.inputTextarea) {
      // @ts-ignore
      this.inputTextarea.nativeElement.rows = this.rows || DEFAULT_TEXTAREA_ROWS;
      // @ts-ignore
      this.inputTextarea.nativeElement.name = this.name || '';
      // @ts-ignore
      this.inputTextarea.nativeElement.title = this.title || '';
      // @ts-ignore
      this.inputTextarea.nativeElement.placeholder = this.placeholder || '';
    }
  }

  public onValueChange(value: any): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
