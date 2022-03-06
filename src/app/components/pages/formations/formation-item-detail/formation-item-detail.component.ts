import {Component, Input} from '@angular/core';
import { IDetail } from '../../../../core/core-index';

@Component({
  selector: 'app-formation-item-detail',
  templateUrl: './formation-item-detail.component.html',
  styleUrls: ['./formation-item-detail.component.scss']
})
export class FormationItemDetailComponent {
  @Input() detail: IDetail = {} as IDetail;

  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
