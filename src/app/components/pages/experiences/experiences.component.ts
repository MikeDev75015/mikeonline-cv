import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IExperience } from '../../../core/core-index';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

/**
 * The component of the experiences page.
 */
@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
})
export class ExperiencesComponent implements OnInit {
  /**
   * An observable allowing to initialize the page when data are loaded.
   */
  public isLoadingData$: Observable<boolean> = of(true);

  /**
   * Contains the experiences loaded.
   */
  public experienceList: IExperience[] | undefined;

  /**
   * @ignore
   * @param dataService
   */
  constructor(
    private readonly dataService: DataService,
  ) {
  }

  /**
   * Initializes the component when data are loaded.
   * Sort experiences by start date.
   */
  async ngOnInit(): Promise<void> {
    this.isLoadingData$ = this.dataService.isDataLoaded(selectExperiencesLoaded).pipe(
      tap(async (loaded) => {
        if (loaded) {
          const unsortedList = await this.dataService.getStoreData<IExperience[]>({
            selector: selectAllExperiences, defaultValue: [],
          });

          this.experienceList = UtilsService.sortObjectList<IExperience>(
            unsortedList, 'desc', 'beginDate', 'date',
          );
        }
      }),
      map((loaded) => !loaded),
    );
  }
}
