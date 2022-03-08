import { Component, OnDestroy, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Subscription } from 'rxjs';
import { IProject, ITag } from '../../../core/core-index';
import { DataService, UtilsService } from '../../../shared/shared-index';

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
export class PortfolioComponent implements OnInit, OnDestroy {
  public siteDemoList: IProject[] = [];
  public showImage = false;
  public backgroundImage = '';

  private timeOutToLoad: any;

  private subscriptionList: Subscription[] = [];

  /**
   * @ignore
   * @param dataService
   * @param utilsService
   */
  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.dataService.isProjectsLoaded().subscribe((loaded) => {
        if (loaded) {
          this.dataService.getProjects<IProject[]>().then(
            (list) => {
              const listWithTechnoName: IProject[] = list.map(s => ({
                ...s,
                technoList: this.utilsService.initTechnoListWithTagList(s.tagList as ITag[])
              }));
              this.siteDemoList = UtilsService.sortList<IProject>(listWithTechnoName, 'asc', 'position', 'number');
            },
          );
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  public onLoadBackgroundImage(siteDemo: IProject): void {
    this.onRemoveBackgroundImage();

    this.timeOutToLoad = setTimeout(() => {
      this.backgroundImage = siteDemo.pictureList[0].src;
      this.showImage = true;
      this.timeOutToLoad = null;
    }, 400);
  }

  public onRemoveBackgroundImage(): void {
    if (this.timeOutToLoad) { clearTimeout(this.timeOutToLoad); this.timeOutToLoad = null; }
    if (this.showImage || this.backgroundImage) { this.showImage = false; this.backgroundImage = ''; }
  }
}
