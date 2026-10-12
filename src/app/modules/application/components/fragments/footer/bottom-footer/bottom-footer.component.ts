import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APP_CREDITS } from '../../../../../../core';

@Component({
    selector: 'app-bottom-footer',
    templateUrl: './bottom-footer.component.html',
    standalone: false
})
export class BottomFooterComponent {
  @Input() mobile = false;

  @Output() copyrightClick = new EventEmitter<boolean>();

  public credits = APP_CREDITS;

  public onCopyrightClick(): void {
    this.copyrightClick.emit(true);
  }
}
