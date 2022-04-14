import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';

export type InputWrapperType = 'text' | 'password' | 'number' | 'textarea' | 'dropdown';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
})
export class InputWrapperComponent implements OnInit, AfterViewInit {
  @Input() inlineClass = '';

  @Input() inputType: InputWrapperType = 'text';

  @Input() inputWidth = '250px';

  @Input() inputHeight = '40px';

  @Input() value = '';

  @Input() valueType: 'string' | 'number' = 'string';

  @Input() displayed = '';

  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputNumber', { static: false }) inputNumber: InputText | undefined;

  @ViewChild('inputTextarea', { static: false }) inputTextarea: InputTextarea | undefined;

  // Textarea options
  @Input() rows?: number;

  /**
   * When present, textarea size changes as being typed.
   */
  @Input() autoResize = false;

  // Number options
  /**
   *Default: false  Displays spinner buttons.
   */
  @Input() showButtons = false;

  /**
   *Default: null  Text to display before the value.
   */
  @Input() prefix = '';

  /**
   *Default: decimal  Text to display after the value.
   */
  @Input() suffix = '';

  /**
   *Default: null  Mininum boundary value.
   */
  @Input() min?: number;

  /**
   *Default: null  Maximum boundary value.
   */
  @Input() max?: number;

  /**
   *Default: 1, Step factor to increment/decrement the value.
   */
  @Input() step?: number;

  /**
   *Default: null  Advisory information to display on input.
   */
  @Input() placeholder = '';

  /**
   *Default: null  Maximum number of character allows in the input field.
   */
  @Input() maxlength?: number;

  /**
   *Default: false  When present, it specifies that an input field is read-only.
   */
  @Input() readonly = false;

  /**
   *Default: null  Title text of the input text.
   */
  @Input() title = '';

  /**
   *Default: null  Name of the input field.
   */
  @Input() name = '';

  public type: InputWrapperType = 'text';

  ngOnInit(): void {
    if (!this.inputType) {
      this.inputType = 'text';
    }
    this.type = this.inputType;
  }

  ngAfterViewInit(): void {
    if (this.inputType === 'number' && this.inputNumber) {
      // @ts-ignore
      this.inputNumber.nativeElement.min = this.min || 0;
      // @ts-ignore
      this.inputNumber.nativeElement.max = this.max || 999;
      // @ts-ignore
      this.inputNumber.nativeElement.step = this.step || 1;
    }

    if (this.inputType === 'textarea' && this.inputTextarea) {
      this.inputHeight = 'auto';
      // @ts-ignore
      this.inputTextarea.nativeElement.rows = this.rows || 3;
    }
  }

  public onValueChange(): void {
    this.valueChange.emit(this.value);
  }

  public toggleType(): void {
    this.type = this.type === 'text' ? 'password' : 'text';
  }
}
