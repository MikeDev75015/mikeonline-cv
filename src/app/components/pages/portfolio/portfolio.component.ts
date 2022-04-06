import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProject, ITag } from '../../../core/core-index';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

/**
 * The component of the portfolio page.
 */
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
export class PortfolioComponent implements OnInit {
  /**
   * An observable allowing to initialize the page when data are loaded.
   */
  public isLoadingData$: Observable<boolean> = of(true);

  /**
   * Contains the projects loaded.
   */
  public projectList: IProject[] = [];

  /**
   * A boolean to start/stop animations that show/hide the background image of the project on hover.
   */
  public showImage = false;

  /**
   * Contains the background image URL when the animation starts.
   */
  public backgroundImage = '';

  /**
   A timeout to avoid displaying background images too quickly.
   * @private
   */
  private onLoadTimeout = 400;

  /**
   * Contains the timeout created when loading background image
   * @private
   */
  private timeoutCreated: any;

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

  /**
   * Initializes the component when data are loaded.
   * Add technoList for each project from tags.
   * Sort projects by position.
   */
  async ngOnInit(): Promise<void> {
    this.isLoadingData$ = this.dataService.isDataLoaded(selectProjectsLoaded).pipe(
      tap(async (loaded) => {
        if (loaded) {
          const unsortedList = await this.dataService.getStoreData<IProject[]>({
            selector: selectAllProjects,
            defaultValue: [],
          });

          const listWithTechnoName: IProject[] = unsortedList.map(s => ({
            ...s,
            technoList: this.utilsService.initTechnoListWithTagList(s.tagList as ITag[]),
          }));

          this.projectList = UtilsService.sortObjectList<IProject>(listWithTechnoName, 'asc', 'position', 'number');
        }
      }),
      map((loaded) => !loaded),
    );
  }

  /**
   * Displays the project background image
   * @param project
   */
  public onLoadBackgroundImage(project: IProject): void {
    this.onRemoveBackgroundImage();

    this.timeoutCreated = setTimeout(() => {
      this.backgroundImage = project.pictureList[0].src;
      this.showImage = true;
      this.timeoutCreated = null;
    }, this.onLoadTimeout);
  }

  /**
   * Hides the project background image
   */
  public onRemoveBackgroundImage(): void {
    if (this.timeoutCreated) {
      clearTimeout(this.timeoutCreated);
      this.timeoutCreated = null;
    }
    if (this.showImage || this.backgroundImage) {
      this.showImage = false;
      this.backgroundImage = '';
    }
  }
}
