import {Component, Input} from '@angular/core';
import { IDetail } from '../../../../core/core-index';
import { UtilsService } from '../../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-formation-item-detail',
  templateUrl: './formation-item-detail.component.html',
  styleUrls: ['./formation-item-detail.component.scss']
})
export class FormationItemDetailComponent {
  @Input() detail: IDetail | undefined;

  constructor(
    private readonly utilsService: UtilsService,
  ) {}

  public openUrl(url: string): void {
    this.utilsService.openURL(url);
  }
}
