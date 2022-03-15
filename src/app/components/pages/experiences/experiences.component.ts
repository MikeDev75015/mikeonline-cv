import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExperience } from '../../../core/core-index';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
})
export class ExperiencesComponent implements OnInit, OnDestroy {
  public experienceList: IExperience[] = [];

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.dataService.isDataLoaded(selectExperiencesLoaded).subscribe((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IExperience[]>({
            selector: selectAllExperiences, defaultValue: [],
          }).then(
            (list) => {
              this.experienceList = UtilsService.sortList<IExperience>(
                UtilsService.addMissingEndDate<IExperience>(list),
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
