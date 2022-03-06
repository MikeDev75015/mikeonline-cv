import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IAnimationServiceResponse } from './core/core-index';
import { AlertService } from './core/modules/alert/alert.service';
import { LoggerService } from './core/modules/logger/logger.service';
import * as ApplicationActions from './core/ngrx/actions/application.actions';
import { selectAppHideHeader } from './core/ngrx/selectors/application.selectors';
import { AnimationsService } from './core/services/animations/animations.service';
import { ContactOpenCloseService } from './core/services/contact-open-close/contact-open-close.service';
import { DataService, HEADER_ANIMATION, UtilsService } from './shared/shared-index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: HEADER_ANIMATION,
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  hideHeaderTimeOut: any;
  timeOutTimeToHide = 4000;
  pageYOffset = 0;
  mobileView = false;
  isHeaderHidden = false;
  headerHeight = '';
  headerOnAnimation = true;

  sectionElement: HTMLElement | undefined;
  sectionMarginBottom = 0;
  matTabHeaderHeight = 0;
  sectionBoundingClientRect: DOMRect | undefined;
  scrollInterval: any;
  intervalTimeToScroll = 50;
  scrollValue = 50;
  enableScroll = false;
  disableScrollButtons: string[] = [];

  minHeightView = 483;
  heightView: number | undefined;

  splashScreenDelay = 4000;
  introductionTime = false;
  waitingFor: 'hideHeader' | 'showHeader' | undefined;

  subscriptionList: Subscription[] = [];

  constructor(
    private readonly store: Store,
    private readonly dataService: DataService,
    private readonly alertService: AlertService,
    private readonly utilService: UtilsService,
    private readonly animationService: AnimationsService,
    private readonly contactOpenCloseService: ContactOpenCloseService,
    private readonly logger: LoggerService,
    private readonly swPush: SwPush,
    private readonly swUpdate: SwUpdate,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    this.store.dispatch(ApplicationActions.startAppLoading());
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.animationService.watchResponse().subscribe(
        (animationServiceResponse) => {
          this.onAnimationServiceResponse(animationServiceResponse)
        },
      )
    );

    this.subscriptionList.push(
      this.store.select(selectAppHideHeader).subscribe((appHideHeader) => {
        if (this.mobileView) {
          return;
        }

        if (appHideHeader && !this.isHeaderHidden) {
          if (!this.introductionTime) {
            this.waitingFor = 'hideHeader';
            return;
          }
          this.hideHeader();
        } else if (!appHideHeader && this.isHeaderHidden) {
          if (!this.introductionTime) {
            this.waitingFor = 'showHeader';
            return;
          }
          this.showHeader();
        }
      }),
    );

    this.subscriptionList.push(
      this.dataService.isAllDataLoaded().subscribe((isAllDataLoaded) => {
        if (!isAllDataLoaded) {
          return;
        }

        this.store.dispatch(ApplicationActions.appLoadingSuccess());
      }),
    );

    this.updateView();

    this.initPWA();

    this.addEventListenersToWindow();
  }

  public ngOnDestroy(): void {
    this.stopAutoHideHeaderTimeout();

    this.subscriptionList.forEach(s => s.unsubscribe());
    this.removeEventListenerFromWindow();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.introductionTime = true;

      if (this.waitingFor) {
        this[this.waitingFor]();
      }
    }, this.splashScreenDelay);
  }

  public ngAfterViewChecked(): void {
    if (!this.mobileView) {
      if (!this.headerOnAnimation) {
        this.updateScrollingState();
      } else {
        this.enableScroll = false;
      }
      this.cdRef.detectChanges();
    }

  }

  public onAnimation = (e: any) => this.animationService.onPhase(e);

  public showHeader(): void {
    this.stopAutoHideHeaderTimeout();
    this.pageYOffset = 0;
    this.updateWrapperHeaderHeight();
    this.isHeaderHidden = false;
  }

  public hideHeader(auto = false): void {
    this.hideHeaderTimeOut = setTimeout(() => {
      this.updateWrapperHeaderHeight();
      this.isHeaderHidden = true;
      this.stopAutoHideHeaderTimeout();
    }, auto ? this.timeOutTimeToHide : 1);
  }

  private onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (!animationServiceResponse.type) {
      return;
    }

    if (animationServiceResponse.type.includes('start')) {
      this.headerOnAnimation = true;
    } else if (animationServiceResponse.type.includes('done')) {
      this.headerOnAnimation = false;
    }
  }

  private initPWA(): void {
    if (this.swPush.isEnabled) {
      const swPushSubscription = this.swPush.notificationClicks.subscribe(notificationPayload => {
        console.log('notificationPayload:', notificationPayload);
      });
      this.subscriptionList.push(swPushSubscription);

      const swUpdateSubscription = this.swUpdate.available.subscribe((event) => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);

        this.alertService.displayConfirmDialog({
          title: 'mise à jour disponible...',
          msg: 'Hey, il existe une version plus récente de cette app ;)',
          closeBtnLabel: 'fermer',
          actionsList: [
            { name: 'mettre à jour', action: 'update' },
          ],
        }).then(action => {
          if (action === 'update') {
            this.swUpdate.activateUpdate().then(() => window.location.reload());
          }
        });
      });
      this.subscriptionList.push(swUpdateSubscription);

      const swActivatedSubscription = this.swUpdate.activated.subscribe(event => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
      this.subscriptionList.push(swActivatedSubscription);

    } else console.log('service worker unavailable');
  }

  private updateView(): void {
    this.pageYOffset = window.pageYOffset;
    this.mobileView = window.innerWidth <= 840;
    if (this.pageYOffset && !this.isHeaderHidden) {
      this.updateWrapperHeaderHeight();
      this.isHeaderHidden = true;
    }
    this.heightView = window.innerHeight;
    this.contactOpenCloseService.setHeightIsTooSmall(this.heightView < this.minHeightView);
  }

  private updateWrapperHeaderHeight(): void {
    const appHeader = document.querySelector('.wrapper-header');
    if (appHeader) {
      const height = this.utilService.convertPixelsToNumber(window.getComputedStyle(appHeader).getPropertyValue('height'), true);
      if (!this.headerHeight.includes('' + height)) {
        this.headerHeight = '-' + height + 'px';
        this.cdRef.detectChanges();
      }
    }
  }

  private stopAutoHideHeaderTimeout(): void {
    if (this.hideHeaderTimeOut) {
      clearTimeout(this.hideHeaderTimeOut);
      this.hideHeaderTimeOut = null;
    }
  }

  private getSectionHeight(): number {
    if (!this.sectionBoundingClientRect) {
      return 0;
    }
    return this.sectionBoundingClientRect.height + this.sectionMarginBottom + this.matTabHeaderHeight;
  }

  private updateScrollingState(): void {
    this.sectionElement = document.querySelector('.app-main .mat-tab-body-active section') as HTMLElement;
    if (this.sectionElement) {
      this.sectionMarginBottom = this.utilService.convertPixelsToNumber(window.getComputedStyle(this.sectionElement)
        .getPropertyValue('margin-bottom'), true);
      this.matTabHeaderHeight = this.utilService.convertPixelsToNumber(window.getComputedStyle(document.querySelector('.app-main .mat-tab-header') as HTMLElement)
        .getPropertyValue('height'), true) + 1;
      this.sectionBoundingClientRect = this.sectionElement.getBoundingClientRect();

      this.enableScroll = this.getSectionHeight() - window.innerHeight > 0;
    }
  }

  private addEventListenersToWindow(): void {
    window.addEventListener('scroll', () => {
      this.scrollEventCallback();
    });
    window.addEventListener('resize', () => {
      this.resizeEventCallback();
    });
    window.addEventListener('mousewheel', () => {
      this.mousewheelEventCallback();
    });
  }

  private removeEventListenerFromWindow(): void {
    window.removeEventListener('scroll', () => {
      this.scrollEventCallback();
    });
    window.removeEventListener('resize', () => {
      this.resizeEventCallback();
    });
    window.removeEventListener('mousewheel', () => {
      this.mousewheelEventCallback();
    });
  }

  private mousewheelEventCallback(): void {
    if (this.sectionElement) {
      this.sectionElement.style.top = '0';
    }
    this.stopAutoHideHeaderTimeout();
    this.updateView();
    if (!this.mobileView) {
      this.updateScrollingState();
    }
    this.cdRef.detectChanges();
  }

  private resizeEventCallback(): void {
    this.stopAutoHideHeaderTimeout();

    this.updateView();

    if (!this.mobileView) {
      this.updateWrapperHeaderHeight();
    }

    this.cdRef.detectChanges();
  }

  private scrollEventCallback(): void {
    this.stopAutoHideHeaderTimeout();
    this.updateView();
    if (!this.mobileView) {
      this.updateScrollingState();
    }
    this.cdRef.detectChanges();
  }
}
