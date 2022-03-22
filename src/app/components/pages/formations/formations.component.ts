import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { isLoadingDisplayTimeout } from '../../../core/constants/common.constant';
import { IFormation } from '../../../core/core-index';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
})
export class FormationsComponent implements OnInit, OnDestroy {
  public isLoadingData: boolean | undefined;

  public formationList: any[] | undefined;

  private readonly subscriptionList: Subscription[] = [];

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
              this.formationList = UtilsService.sortObjectList<IFormation>(
                UtilsService.addMissingEndDate<IFormation>(list),
                'desc', 'endDate', 'date',
              );
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
}
