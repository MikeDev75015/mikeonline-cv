import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../shared';
import { APP_CREDITS } from '../../constants/common.constant';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
})
export class MaintenanceComponent implements OnInit {
  public headerImage = 'assets/img/mikeonline1024.jpg';

  public title = 'Oups !';

  public subTitle = 'Maintenance en cours';

  public credits = APP_CREDITS;

  public mobile = false;

  ngOnInit(): void {
    this.adaptHeaderImage();

    window.addEventListener('resize', () => {
      this.adaptHeaderImage();
    });
  }

  private adaptHeaderImage(): void {
    this.mobile = window.innerWidth <= 840;
    this.headerImage = UtilsService.autoChargeHeaderImage();
  }
}
