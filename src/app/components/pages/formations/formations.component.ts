import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IFormation } from '../../../core/core-index';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
})
export class FormationsComponent implements OnInit, OnDestroy {
  public formationList: any[] = [];

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.dataService.isDataLoaded(selectFormationsLoaded).subscribe((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IFormation[]>({
            selector: selectAllFormations,
            defaultValue: [],
          }).then(
            (list) => {
              this.formationList = UtilsService.sortList<IFormation>(
                UtilsService.addMissingEndDate<IFormation>(list),
                'desc', 'endDate', 'date',
              );
            },
          );
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }
}
