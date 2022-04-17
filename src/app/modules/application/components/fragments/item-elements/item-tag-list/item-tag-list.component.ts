import { Component, Input } from '@angular/core';
import { ITag } from '../../../../../../core';

@Component({
  selector: 'app-item-tag-list',
  templateUrl: './item-tag-list.component.html',
})
export class ItemTagListComponent {
  @Input() tagList: ITag[] | undefined;
}
