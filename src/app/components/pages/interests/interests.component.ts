import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IInterest } from '../../../core/core-index';
import { selectAllInterests, selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { DataService } from '../../../shared/shared-index';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss'],
})
export class InterestsComponent implements OnInit, AfterContentInit {
  public isLoadingData: Observable<boolean> = of(true);

  public interestList: IInterest[] | undefined;

  constructor(
    private readonly dataService: DataService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingData = this.dataService.isDataLoaded(selectInterestsLoaded).pipe(
      tap((loaded) => {
        if (loaded) {
          this.dataService.getStoreData<IInterest[]>({
            selector: selectAllInterests,
            defaultValue: [],
          }).then(
            (list) => {
              this.interestList = list;
            },
          );
        }
      }),
      map((loaded) => !loaded),
    );
  }

  ngAfterContentInit(): void {
    this.cdRef.detectChanges();
  }
}
