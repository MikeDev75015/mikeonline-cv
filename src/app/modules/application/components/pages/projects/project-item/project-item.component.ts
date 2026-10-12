import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UtilsService } from '../../../../../../shared';
import { ProjectItem } from '../../../../interfaces/project-item.interface';

@Component({
    selector: 'app-project-item',
    templateUrl: './project-item.component.html',
    styleUrls: ['./project-item.component.scss'],
    standalone: false
})
export class ProjectItemComponent implements OnInit, OnDestroy {
  mobileView = false;

  @Input({ required: true }) project!: ProjectItem;

  constructor(
    private readonly utilsService: UtilsService,
  ) {
  }

  ngOnInit() {
    this.mobileView = window.innerWidth <= 840;
    window.addEventListener('resize', () => this.mobileView = window.innerWidth <= 840);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.mobileView = window.innerWidth <= 840);
  }

  openLinkInTab(link: string): void {
    this.utilsService.openURL(link);
  }
}
