import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IExperience } from '../../../core';
import { DataService } from '../../../shared';

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
          this.dataService.getExperiences<IExperience[]>().then(
            (list) => {
              this.experienceList = list;
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
