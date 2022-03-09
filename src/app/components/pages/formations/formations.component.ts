import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IFormation } from '../../../core/core-index';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { MomentService } from '../../../core/services/moment/moment.service';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss'],
})
export class FormationsComponent implements OnInit, OnDestroy {
  formationList: any[] = [];

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit() {
    this.subscriptionList.push(
      this.dataService.isDataLoaded(selectFormationsLoaded).subscribe((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IFormation[]>({
            selector: selectAllFormations,
            defaultValue: [],
          }).then(
            (list) => {
              this.formationList = UtilsService.sortList<IFormation>(
                list.map((f) => {
                  if (!f.endDate) {
                    return {
                      ...f,
                      endDate: MomentService.getCurrentDate('YYYY-MM'),
                    };
                  }

                  return f;
                }),
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
