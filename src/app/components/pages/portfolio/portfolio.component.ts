import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { isLoadingDisplayTimeout } from '../../../core/constants/common.constant';
import { IProject, ITag } from '../../../core/core-index';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  animations: [
    trigger('showHideBackgroundImage', [
      state('show', style({
        opacity: 0.3,
      })),
      state('hide', style({
        opacity: 0,
      })),
      transition('hide => show', [
        animate(500),
      ]),
      transition('show => hide', [
        animate(0),
      ]),
    ]),
  ],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  public isLoadingData: boolean | undefined;

  public siteDemoList: IProject[] = [];

  public showImage = false;

  public backgroundImage = '';

  private timeOutToLoad: any;

  private readonly subscriptionList: Subscription[] = [];

  /**
   * @ignore
   * @param dataService
   * @param utilsService
   */
  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.dataService.isDataLoaded(selectProjectsLoaded).subscribe((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IProject[]>({
            selector: selectAllProjects,
            defaultValue: [],
          }).then(
            (list) => {
              const listWithTechnoName: IProject[] = list.map(s => ({
                ...s,
                technoList: this.utilsService.initTechnoListWithTagList(s.tagList as ITag[]),
              }));
              this.siteDemoList = UtilsService.sortObjectList<IProject>(listWithTechnoName, 'asc', 'position', 'number');
              setTimeout(() => {
                this.isLoadingData = false;
              }, isLoadingDisplayTimeout);
            },
          );
        } else {
          this.isLoadingData = true;
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
    if (this.timeOutToLoad) {
      clearTimeout(this.timeOutToLoad);
      this.timeOutToLoad = null;
    }
    if (this.showImage || this.backgroundImage) {
      this.showImage = false;
      this.backgroundImage = '';
    }
  }
}
