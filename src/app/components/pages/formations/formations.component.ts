import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IFormation } from '../../../core/core-index';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
})
export class FormationsComponent implements OnInit {
  public isLoadingData: Observable<boolean> = of(true);

  public formationList: any[] | undefined;

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingData = this.dataService.isDataLoaded(selectFormationsLoaded).pipe(
      tap((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IFormation[]>({
            selector: selectAllFormations,
            defaultValue: [],
          }).then(
            (list) => {
              this.formationList = UtilsService.sortObjectList<IFormation>(
                UtilsService.addMissingEndDate<IFormation>(list),
                'desc', 'endDate', 'date',
              );
            },
          );
        }
      }),
      map((loaded) => !loaded),
    );
  }
}
