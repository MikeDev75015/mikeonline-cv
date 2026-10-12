import { Component, Input } from '@angular/core';
import { IDetail } from '../../../../../../core';
import { UtilsService } from '../../../../../../shared';

@Component({
    selector: 'app-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss'],
    standalone: false
})
export class ItemDetailComponent {
  @Input() detail: IDetail | undefined;

  constructor(
    private readonly utilsService: UtilsService,
  ) {
  }

  public openUrl(url: string): void {
    this.utilsService.openURL(url);
  }
}
