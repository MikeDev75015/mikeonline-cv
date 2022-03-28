import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IExperience } from '../../../core/core-index';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { DataService, UtilsService } from '../../../shared/shared-index';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
})
export class ExperiencesComponent implements OnInit {
  public isLoadingData: Observable<boolean> = of(true);

  public experienceList: IExperience[] | undefined;

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingData = this.dataService.isDataLoaded(selectExperiencesLoaded).pipe(
      tap((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IExperience[]>({
            selector: selectAllExperiences, defaultValue: [],
          }).then(
            (list) => {
              this.experienceList = UtilsService.sortObjectList<IExperience>(
                list, 'desc', 'beginDate', 'date',
              );
            },
          );
        }
      }),
      map((loaded) => !loaded),
    );
  }
}
