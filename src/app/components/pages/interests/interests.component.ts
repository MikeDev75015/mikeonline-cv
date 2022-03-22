import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { isLoadingDisplayTimeout } from '../../../core/constants/common.constant';
import { IInterest } from '../../../core/core-index';
import { selectAllInterests, selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { DataService } from '../../../shared/shared-index';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss'],
})
export class InterestsComponent implements OnInit, AfterContentInit, OnDestroy {
  public isLoadingData: boolean | undefined;

  public interestList: IInterest[] | undefined;

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.dataService.isDataLoaded(selectInterestsLoaded).subscribe((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IInterest[]>({
            selector: selectAllInterests,
            defaultValue: [],
          }).then(
            (list) => {
              this.interestList = list;
              setTimeout(() => {
                this.isLoadingData = false;
              }, isLoadingDisplayTimeout);
            }
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

  ngAfterContentInit(): void {
    this.cdRef.detectChanges();
  }
}
