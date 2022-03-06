import {Component, EventEmitter, Input, Output} from '@angular/core';
import { APP_CREDITS } from '../../../../core/core-index';

@Component({
  selector: 'app-bottom-footer',
  templateUrl: './bottom-footer.component.html',
  styleUrls: ['./bottom-footer.component.scss']
})
export class BottomFooterComponent {
  @Input() mobile = false;
  @Output() copyrightClick = new EventEmitter<boolean>();
  credits = APP_CREDITS;

  onCopyrightClick() {
    this.copyrightClick.emit(true);
  }
}
