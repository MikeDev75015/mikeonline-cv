import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
})
export class InputWrapperComponent implements OnInit {
  @Input() inputType: 'text' | 'password' = 'text';

  @Input() inputWidth = '250px';

  @Input() inputHeight = '40px';

  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();

  type: 'text' | 'password' = 'text';

  public ngOnInit(): void {
    this.type = this.inputType;
  }

  public onValueChange(): void {
    this.valueChange.emit(this.value);
  }

  public toggleType(): void {
    this.type = this.type === 'text' ? 'password' : 'text';
  }
}
