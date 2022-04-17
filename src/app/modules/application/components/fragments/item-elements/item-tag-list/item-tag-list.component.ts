import { Component, Input } from '@angular/core';
import { TagV1 } from '../../../../../../core/interfaces/models/v1/tag.interface';

@Component({
  selector: 'app-item-tag-list',
  templateUrl: './item-tag-list.component.html',
})
export class ItemTagListComponent {
  @Input() tagList: TagV1[] | undefined;
}
