import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CvInfosV1 } from '../../../../../core/interfaces/models/v1/cv-infos.interface';
import { selectAppCvInfosLoaded } from '../../../../../core/ngrx/selectors/application.selectors';
import { selectCvInfos } from '../../../../../core/ngrx/selectors/cv-infos.selectors';
import { DataService, UtilsService } from '../../../../../shared';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  public headerImage = 'assets/img/mikeonline1024.jpg';

  public title = '';

  public subTitle = '';

  private mobile = false;

  private readonly subscriptionList: Subscription[] = [];

  /**
   * @ignore
   * @param dataService
   * @param store
   */
  constructor(
    private readonly dataService: DataService,
    private readonly store: Store,
  ) {
  }

  ngOnInit(): void {
    this.adaptHeaderImage();

    window.addEventListener('resize', () => {
      this.adaptHeaderImage();
    });

    this.dataService.getStoreData({
      selector: selectCvInfos,
      defaultValue: undefined,
    }).then((cvInfos) => {
      if (!cvInfos || !cvInfos.title) {
        this.subscribeToApplicationCvInfosLoaded();
        return;
      }

      this.initializeComponent(cvInfos);
    });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  private adaptHeaderImage(): void {
    this.mobile = window.innerWidth <= 840;
    this.headerImage = UtilsService.autoChargeHeaderImage();
  }

  private initializeComponent(cvInfos: CvInfosV1): void {
    this.title = cvInfos.title;
    this.subTitle = cvInfos.technoList?.join(' - ') || '';
  }

  private subscribeToApplicationCvInfosLoaded(): void {
    this.subscriptionList.push(
      this.store.select(selectAppCvInfosLoaded).subscribe((cvInfosLoaded) => {
        if (!cvInfosLoaded) {
          return;
        }

        this.dataService.getStoreData({
          selector: selectCvInfos,
          defaultValue: undefined,
        }).then((cvInfos) => {
          if (!cvInfos) {
            return;
          }
          this.initializeComponent(cvInfos);
        });
      }),
    );
  }
}
