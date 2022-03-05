import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { IProject, ITag } from '../../../core';
import { DataService } from '../../../shared/services/data/data.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
    trigger('showHideBackgroundImage', [
      state('show', style({
        opacity: 0.3
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('hide => show', [
        animate(500)
      ]),
      transition('show => hide', [
        animate(0)
      ]),
    ])
  ]
})
export class PortfolioComponent implements OnInit {
  siteDemoList: IProject[] = [];
  showImage = false;
  backgroundImage = '';
  timeOutToLoad: any;

  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService
  ) {
  }

  async ngOnInit() {
    this.siteDemoList = (await this.dataService.getProjects<IProject[]>()).map(s => ({
      ...s,
      technoList: this.utilsService.initTechnoListWithTagList(s.tagList as ITag[])
    }));
  }

  onLoadBackgroundImage(siteDemo: IProject): void {
    this.onRemoveBackgroundImage();

    this.timeOutToLoad = setTimeout(() => {
      this.backgroundImage = siteDemo.pictureList[0].src;
      this.showImage = true;
      this.timeOutToLoad = null;
    }, 400);
  }

  onRemoveBackgroundImage(): void {
    if (this.timeOutToLoad) { clearTimeout(this.timeOutToLoad); this.timeOutToLoad = null; }
    if (this.showImage || this.backgroundImage) { this.showImage = false; this.backgroundImage = ''; }
  }
}
