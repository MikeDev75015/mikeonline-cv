import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IFormation } from '../../../../../core';
import { selectAllFormations, selectFormationsLoaded } from '../../../../../core/ngrx/selectors/formations.selectors';
import { DataService, UtilsService } from '../../../../../shared';

/**
 * The component of the formations page.
 */
@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
})
export class FormationsComponent implements OnInit {
  /**
   * An observable allowing to initialize the page when data are loaded.
   */
  public isLoadingData$: Observable<boolean> = of(true);

  /**
   * Contains the formations loaded.
   */
  public formationList: any[] | undefined;

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
   * Add missing end date if needed.
   * Sort formations by end date.
   */
  async ngOnInit(): Promise<void> {
    this.isLoadingData$ = this.dataService.isDataLoaded(selectFormationsLoaded).pipe(
      tap(async (loaded) => {
        if (loaded) {
          const unsortedList = await this.dataService.getStoreData<IFormation[]>({
            selector: selectAllFormations,
            defaultValue: [],
          });

          this.formationList = UtilsService.sortObjectList<IFormation>(
            UtilsService.addMissingEndDate<IFormation>(unsortedList),
            'desc', 'endDate', 'date',
          );
        }
      }),
      map((loaded) => !loaded),
    );
  }
}
