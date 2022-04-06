import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { IProject } from '../../../../core/core-index';
import { UtilsService } from '../../../../shared/shared-index';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit, OnDestroy {
  mobileView = false;
  @Input() project: IProject | undefined;

  constructor(
    private readonly utilsService: UtilsService,
  ) {}

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
