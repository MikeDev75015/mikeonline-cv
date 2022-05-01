import { Component, Input } from '@angular/core';
import { ILink } from '../../../../../../core';
import { UtilsService } from '../../../../../../shared';

@Component({
  selector: 'app-item-links',
  templateUrl: './item-links.component.html',
})
export class ItemLinksComponent {
  @Input() linkList: ILink[] | undefined;

  constructor(
    private readonly utilsService: UtilsService,
  ) {
  }

  public onClickLink(link: ILink): void {
    this.utilsService.openURL(link.url, '_blank');
  }
}
