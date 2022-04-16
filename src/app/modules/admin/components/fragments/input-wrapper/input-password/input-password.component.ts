import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { DEFAULT_INPUT_HEIGHT, DEFAULT_INPUT_WIDTH } from '../constants/input-wrapper.constant';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
})
export class InputPasswordComponent implements AfterViewInit {
  @ViewChild('inputPasswordWrapped', { static: false }) inputPassword: InputText | undefined;

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

  public type: 'password' | 'text' = 'password';

  ngAfterViewInit(): void {
    if (this.inputPassword) {
      // @ts-ignore
      this.inputPassword.nativeElement.name = this.name || '';
      // @ts-ignore
      this.inputPassword.nativeElement.title = this.title || '';
      // @ts-ignore
      this.inputPassword.nativeElement.placeholder = this.placeholder || '';
    }
  }

  public onValueChange(value: any): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  public toggleType(): void {
    this.type = this.type === 'text' ? 'password' : 'text';
  }
}
