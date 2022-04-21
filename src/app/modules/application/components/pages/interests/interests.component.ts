import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { InterestV1 } from '../../../../../core/interfaces/models/v1/interest.interface';
import { selectAllInterests, selectInterestsLoaded } from '../../../../../core/ngrx/selectors/interests.selectors';
import { DataService, UtilsService } from '../../../../../shared';

/**
 * The component of the interests page.
 */
@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss'],
})
export class InterestsComponent implements OnInit, AfterContentInit {
  /**
   * An observable allowing to initialize the page when data are loaded.
   */
  public isLoadingData$: Observable<boolean> = of(true);

  /**
   * Contains the interests loaded.
   */
  public interestList: InterestV1[] | undefined;

  /**
   * @ignore
   * @param dataService
   * @param cdRef
   */
  constructor(
    private readonly dataService: DataService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  /**
   * Initializes the interests list when data are loaded.
   */
  async ngOnInit(): Promise<void> {
    this.isLoadingData$ = this.dataService.isDataLoaded(selectInterestsLoaded).pipe(
      tap(async (loaded) => {
        if (loaded) {
          const unsortedList = await this.dataService.getStoreData<InterestV1[]>({
            selector: selectAllInterests,
            defaultValue: [],
          });

          this.interestList = UtilsService.sortObjectList<InterestV1>(unsortedList, 'asc', 'position', 'number');
        }
      }),
      map((loaded) => !loaded),
    );
  }

  /**
   * Forces to detect changes detection after content is initialized
   */
  ngAfterContentInit(): void {
    this.cdRef.detectChanges();
  }
}
