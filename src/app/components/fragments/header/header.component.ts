import {Component, OnInit} from '@angular/core';
import { APP_CREDITS } from '../../../core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  mobile = false;
  title = APP_CREDITS.title;
  subTitle = APP_CREDITS.subTitle;

  headerImage = 'assets/img/mikeonline1024.jpg';

  ngOnInit() {
    this.mobile = window.innerWidth <= 840;
    this.headerImage = this.autoChargeImg();

    window.addEventListener('resize', () => {
      this.mobile = window.innerWidth <= 840;
      this.headerImage = this.autoChargeImg();
    });
  }

  autoChargeImg(): string {
    if (window.innerWidth > 768) {
      return 'assets/img/mikeonline1024.jpg';
    } else if (window.innerWidth > 480) {
      return 'assets/img/mikeonline768.jpg';
    } else if (window.innerWidth > 320) {
      return 'assets/img/mikeonline480.jpg';
    } else {
      return 'assets/img/mikeonline320.jpg';
    }
  }

}
