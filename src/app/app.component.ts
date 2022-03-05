import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IAnimationServiceResponse } from './core';
import * as CvInfosActions from './core/ngrx/actions/cv-infos.actions';
import { AnimationsService } from './core/services/animations/animations.service';
import { ContactOpenCloseService } from './core/services/contact-open-close/contact-open-close.service';
import { AlertService } from './modules/alert/alert.service';
import { LoggerService } from './modules/logger/logger.service';
import { UtilsService } from './shared/services/utils/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  subscriptionList: Subscription[] = [];

  hideHeaderTimeOut: any;
  timeOutTimeToHide = 4000;
  pageYOffset = 0;
  mobileView = false;
  hideHeader = false;
  headerHeight = '';
  headerOnAnimation = true;

  sectionElement: HTMLElement = {} as HTMLElement;
  sectionMarginBottom = 0;
  matTabHeaderHeight = 0;
  sectionBoundingClientRect: DOMRect = {} as DOMRect;
  scrollInterval: any;
  intervalTimeToScroll = 50;
  scrollValue = 50;
  enableScroll = false;
  disableScrollButtons: string[] = [];

  minHeightView = 483;
  heightView = 200;

  constructor(
    private readonly store: Store,
    private readonly alertService: AlertService,
    private readonly utilService: UtilsService,
    private readonly animationService: AnimationsService,
    private readonly contactOpenCloseService: ContactOpenCloseService,
    private readonly logger: LoggerService,
    private readonly swPush: SwPush,
    private readonly swUpdate: SwUpdate,
    private readonly cdref: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.updateView();
    if (!this.mobileView) { this.autoHideHeader(); }

    const animationServiceSubscription = this.animationService.watchResponse()
      .subscribe(
        animationServiceResponse => this.onAnimationServiceResponse(animationServiceResponse)
      );
    this.subscriptionList.push(animationServiceSubscription);

    this.initPWA();

    window.addEventListener('scroll', () => {
      this.stopAutoHideHeaderTimeout();
      this.updateView();
      if (!this.mobileView) {
        this.updateScrollingState();
      }
      this.cdref.detectChanges();
    });

    window.addEventListener('resize', () => {
      this.stopAutoHideHeaderTimeout();
      this.updateView();
      if (!this.mobileView) {
        this.updateWrapperHeaderHeight();
      }
      this.cdref.detectChanges();
    });

    window.addEventListener('mousewheel', () => {
      if (this.sectionElement) {
        this.sectionElement.style.top = '0';
      }
      this.stopAutoHideHeaderTimeout();
      this.updateView();
      if (!this.mobileView) {
        this.updateScrollingState();
      }
      this.cdref.detectChanges();
    });

    this.store.dispatch(CvInfosActions.loadCvInfos());
  }

  ngOnDestroy() {
    this.stopAutoHideHeaderTimeout();
    this.stopScrolling();
    this.subscriptionList.forEach(s => s.unsubscribe());

    window.removeEventListener('scroll', () => {
      this.stopAutoHideHeaderTimeout();
      this.updateView();
      if (!this.mobileView) {
        this.updateScrollingState();
      }
      this.cdref.detectChanges();
    });
    window.removeEventListener('resize', () => {
      this.stopAutoHideHeaderTimeout();
      this.updateView();
      if (!this.mobileView) {
        this.updateWrapperHeaderHeight();
      }
      this.cdref.detectChanges();
    });
    window.removeEventListener('mousewheel', () => {
      if (this.sectionElement) {
        this.sectionElement.style.top = '0';
      }
      this.stopAutoHideHeaderTimeout();
      this.updateView();
      if (!this.mobileView) {
        this.updateScrollingState();
      }
      this.cdref.detectChanges();
    });
  }

  ngAfterViewChecked() {
    if (!this.mobileView) {
      if (!this.headerOnAnimation) {
        this.updateScrollingState();
        this.cdref.detectChanges();
      } else {
        this.enableScroll = false;
        this.cdref.detectChanges();
      }
    }

  }

  initPWA(): void {
    if (this.swPush.isEnabled) {
      const swPushSubscription = this.swPush.notificationClicks.subscribe(notpayload => {
        // console.log("notification push click :\n", notpayload);
        // const pushNotif = notpayload.notification;
        const pushAction = notpayload.action;

        if (pushAction.indexOf("/") !== -1) {
          // console.log("navigate to " + pushAction);
        }
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
            { name: 'mettre à jour', action: 'update' }
          ]
        }).then(action => {
          if (action === 'update') {
            this.swUpdate.activateUpdate().then(() => window.location.reload());
          }
        })
      });
      this.subscriptionList.push(swUpdateSubscription);

      const swActivatedSubscription = this.swUpdate.activated.subscribe(event => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
      this.subscriptionList.push(swActivatedSubscription);

    } else console.log("service worker non disponible");
  }

  // Services Methods
  onAnimation = (e: any) => this.animationService.onPhase(e);

  // Local Methods
  updateView(): void {
    this.pageYOffset = window.pageYOffset;
    this.mobileView = window.innerWidth <= 840;
    if (this.pageYOffset && !this.hideHeader) {
      this.updateWrapperHeaderHeight();
      this.hideHeader = true;
    }
    this.heightView = window.innerHeight;
    this.contactOpenCloseService.setHeightIsTooSmall(this.heightView < this.minHeightView);
  }

  onAnimationServiceResponse(animationServiceResponse: IAnimationServiceResponse): void {
    if (!animationServiceResponse.type) { return; }

    if (animationServiceResponse.type.includes('start')) {
      this.headerOnAnimation = true;
    } else if (animationServiceResponse.type.includes('done')) {
      this.headerOnAnimation = false;
    }
  }

  updateWrapperHeaderHeight(): void {
    const appHeader = document.querySelector('.wrapper-header');
    if (appHeader) {
      const height = this.utilService.convertPixelsToNumber(window.getComputedStyle(appHeader).getPropertyValue('height'), true);
      if (!this.headerHeight.includes('' + height)) {
        // console.log('headerHeight', this.headerHeight, '\nheight', height);
        this.headerHeight = '-' + height + 'px';
        this.cdref.detectChanges();
      }
    }
  }
  showHeader(): void {
    this.stopAutoHideHeaderTimeout();
    this.pageYOffset = 0;
    this.updateWrapperHeaderHeight();
    this.hideHeader = false;
  }
  autoHideHeader(): void {
    this.hideHeaderTimeOut = setTimeout(() => {
      this.updateWrapperHeaderHeight();
      this.hideHeader = true;
      this.stopAutoHideHeaderTimeout();
    }, this.timeOutTimeToHide);
  }
  stopAutoHideHeaderTimeout(): void {
    if (this.hideHeaderTimeOut) {
      clearTimeout(this.hideHeaderTimeOut);
      this.hideHeaderTimeOut = null;
    }
  }

  getSectionHeight(): number {
    return this.sectionBoundingClientRect.height + this.sectionMarginBottom + this.matTabHeaderHeight;
  }
  isScrollToTopLimit(valueToTest = false): boolean | number {
    if (!valueToTest) {
      return (this.matTabHeaderHeight -
        this.sectionBoundingClientRect.top) <= 5;
    }
    return (this.matTabHeaderHeight -
      this.sectionBoundingClientRect.top);
  }
  isScrollToBottomLimit(valueToTest = false): boolean | number {
    // tslint:disable-next-line:max-line-length
    if (!valueToTest) {
      return (this.sectionBoundingClientRect.height +
        this.sectionMarginBottom - window.innerHeight +
        this.sectionBoundingClientRect.top) <= 5;
    }
    return (this.sectionBoundingClientRect.height +
      this.sectionMarginBottom - window.innerHeight);
  }
  updateScrollingState(): void {
    this.sectionElement = document.querySelector('.app-main .mat-tab-body-active section') as HTMLElement;
    if (this.sectionElement) {
      this.sectionMarginBottom = this.utilService.convertPixelsToNumber(window.getComputedStyle(this.sectionElement)
        .getPropertyValue('margin-bottom'), true);
      this.matTabHeaderHeight = this.utilService.convertPixelsToNumber(window.getComputedStyle(document.querySelector('.app-main .mat-tab-header') as HTMLElement)
        .getPropertyValue('height'), true) + 1;
      this.sectionBoundingClientRect = this.sectionElement.getBoundingClientRect();

      this.enableScroll = this.getSectionHeight() - window.innerHeight > 0;    }
  }
  scrollPage(action: string): void {
    if (action === 'scrollToTheTop') {
      if (!this.scrollLimit(this.scrollValue)) { this.startScrolling(this.scrollValue); }
    } else if (action === 'scrollToTheBottom') {
      const expectedValue = (-1 * this.scrollValue);
      if (!this.scrollLimit(expectedValue)) { this.startScrolling(expectedValue); }
    } else if (action === 'stop') {
      this.stopScrolling();
    } else {
      this.stopScrolling();
    }
  }
  scrollLimit(value: number): boolean {
    const scrollToTopLimit = this.isScrollToTopLimit(true) as number;
    const scrollToBottomLimit = (this.isScrollToBottomLimit(true) as number) * -1;
    const sectionTop = this.utilService.convertPixelsToNumber(this.sectionElement.style.top);
    console.log(
      '\nvalue', value,
      '\nscrollToTopLimit', scrollToTopLimit,
      '\nscrollToBottomLimit', scrollToBottomLimit,
      '\nsection top', sectionTop,
      '\nthis.sectionBoundingClientRect.top', this.sectionBoundingClientRect.top,
      '\nthis.sectionBoundingClientRect.bottom', this.sectionBoundingClientRect.bottom,
      '\nscrollToTopLimit + value', scrollToTopLimit + value,
      '\nscrollToBottomLimit + value', scrollToBottomLimit + value
    );

    /*if (value > 0 && (scrollToTopLimit + value >= 0)) {
     this.stopScrolling();
     this.sectionElement.style.top = '0';
     return true;
     }*/

    /*if (value < 0 && (scrollToBottomLimit + value < 0)) {
     this.stopScrolling();
     const diff = scrollToBottomLimit;
     this.sectionElement.style.top = (this.convertPixelsToNumber(this.sectionElement.style.top) + diff) + 'px';
     return true;
     }*/
    return false;
  }
  startScrolling(value: number) {
    this.scrollInterval = setInterval(() => {
      if (!this.scrollLimit(value)) { this.scrollTopBy(value); }
    }, this.intervalTimeToScroll);
  }
  stopScrolling(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
  scrollTopBy(value: number) {
    this.sectionElement.style.top = (this.utilService.convertPixelsToNumber(this.sectionElement.style.top) + value) + 'px';
  }
}
