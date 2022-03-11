import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn-mobile-contact',
  templateUrl: './btn-mobile-contact.component.html',
  styleUrls: ['./btn-mobile-contact.component.scss'],
})
export class BtnMobileContactComponent {
  @Input() btnClass = '';

  @Input() btnIcon = '';

  @Input() btnImage: { src: string; alt: string; } = {
    src: '',
    alt: '',
  };

  @Input() btnText = '';
}
