import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { IProject } from '../../../../core';

@Component({
  selector: 'app-portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.scss']
})
export class PortfolioItemComponent implements OnInit, OnDestroy {
  mobileView = false;
  @Input() siteDemo: IProject = {} as IProject;

  ngOnInit() {
    this.mobileView = window.innerWidth <= 840;
    window.addEventListener('resize', () => this.mobileView = window.innerWidth <= 840);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.mobileView = window.innerWidth <= 840);
  }

  openLinkInTab(link: string): void {
    window.open(link, '_blank');
  }
}
