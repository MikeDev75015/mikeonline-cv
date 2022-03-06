import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IInterest } from '../../../core/core-index';
import { DataService } from '../../../shared/shared-index';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit, OnDestroy {
  interestList: IInterest[] | undefined;

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit() {
    this.subscriptionList.push(
      this.dataService.isInterestsLoaded().subscribe((loaded) => {
        if (loaded) {
          this.dataService.getInterests<IInterest[]>().then(
            (list) => {
              this.interestList = list;
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
