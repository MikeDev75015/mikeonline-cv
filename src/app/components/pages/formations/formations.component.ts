import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IFormation } from '../../../core';
import { DataService } from '../../../shared';

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
      this.dataService.isFormationsLoaded().subscribe((loaded) => {
        if (loaded) {
          this.dataService.getFormations<IFormation[]>().then(
            (list) => {
              this.formationList = list;
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
