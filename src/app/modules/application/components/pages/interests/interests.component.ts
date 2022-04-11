import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IInterest } from '../../../../../core/core-index';
import { selectAllInterests, selectInterestsLoaded } from '../../../../../core/ngrx/selectors/interests.selectors';
import { DataService } from '../../../../../shared/shared-index';

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
  public interestList: IInterest[] | undefined;

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
          this.interestList = await this.dataService.getStoreData<IInterest[]>({
            selector: selectAllInterests,
            defaultValue: [],
          });
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
