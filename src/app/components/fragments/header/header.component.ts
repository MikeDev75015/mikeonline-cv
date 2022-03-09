import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectAppCvInfosLoaded } from '../../../core/ngrx/selectors/application.selectors';
import { ICvInfos } from '../../../core/core-index';
import { selectCvInfos } from '../../../core/ngrx/selectors/cv-infos.selectors';
import { DataService } from '../../../shared/shared-index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public headerImage = 'assets/img/mikeonline1024.jpg';

  public title = '';

  public subTitle = '';

  private mobile = false;

  private subscriptionList: Subscription[] = [];

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

  private static autoChargeImg(): string {
    if (window.innerWidth > 768) {
      return 'assets/img/mikeonline1024.jpg';
    } else if (window.innerWidth > 480) {
      return 'assets/img/mikeonline768.jpg';
    } else if (window.innerWidth > 320) {
      return 'assets/img/mikeonline480.jpg';
    } else {
      return 'assets/img/mikeonline320.jpg';
    }
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
    this.headerImage = HeaderComponent.autoChargeImg();
  }

  private initializeComponent(cvInfos: ICvInfos): void {
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
          this.initializeComponent(cvInfos as ICvInfos);
        });
      }),
    );
  }
}
