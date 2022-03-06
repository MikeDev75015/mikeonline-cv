import {Component, Input} from '@angular/core';
import { IDetail } from '../../../../core/core-index';

@Component({
  selector: 'app-experience-item-detail',
  templateUrl: './experience-item-detail.component.html',
  styleUrls: ['./experience-item-detail.component.scss']
})
export class ExperienceItemDetailComponent {
  @Input() detail: IDetail = {} as IDetail;
}
