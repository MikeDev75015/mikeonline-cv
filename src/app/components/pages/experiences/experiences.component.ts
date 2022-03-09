import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExperience } from '../../../core/core-index';
import { selectAllExperiences } from '../../../core/ngrx/selectors/experiences.selectors';
import { MomentService } from '../../../core/services/moment/moment.service';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss'],
})
export class ExperiencesComponent implements OnInit, OnDestroy {
  experienceList: IExperience[] = [];

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit() {
    this.subscriptionList.push(
      this.dataService.isExperiencesLoaded().subscribe((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IExperience[]>({
            selector: selectAllExperiences, defaultValue: [],
          }).then(
            (list) => {
              this.experienceList = UtilsService.sortList<IExperience>(
                list.map((e) => {
                  if (!e.endDate) {
                    return {
                      ...e,
                      endDate: MomentService.getCurrentDate('YYYY-MM'),
                    };
                  }

                  return e;
                }),
                'desc', 'endDate', 'date'
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
