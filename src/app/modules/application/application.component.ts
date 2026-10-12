import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as ApplicationActions from '../../core/ngrx/actions/application.actions';
import { selectAppHideHeader } from '../../core/ngrx/selectors/application.selectors';
import { ContactOpenCloseService } from '../../core/services/contact-open-close/contact-open-close.service';
import { DataService, HEADER_ANIMATION, IAnimationServiceResponse, UtilsService } from '../../shared';
import { AnimationsService } from '../../shared/services/animations/animations.service';

@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.scss'],
    animations: HEADER_ANIMATION,
    standalone: false
})
export class ApplicationComponent implements OnInit {
  /**
   * A boolean to know if it's the mobile view or not
   */
  public mobileView = false;

  /**
   * A boolean to know if the header is hidden or not
   */
  public isHeaderHidden = false;

  /**
   * A boolean to know if the header is being animated or not
   */
  public headerOnAnimation = true;

  /**
   * Header height retrieved once the view is displayed
   */
  public headerHeight = '';

  private scrollEnabled = false;

  private introductionTime = false;

  private waitingFor: 'hideHeader' | 'showHeader' | undefined;

  private sectionElement: HTMLElement | undefined;

  private sectionBoundingClientRect: DOMRect | undefined;

  private heightView: number | undefined;

  private hideHeaderTimeOut: any;

  private pageYOffset = 0;

  private sectionMarginBottom = 0;

  private matTabHeaderHeight = 0;

  private readonly minHeightView = 483;

  private readonly timeOutTimeToHide = 2000;

  private readonly splashScreenDelay = environment.SPLASH_SCREEN_DELAY;

  private readonly subscriptionList: Subscription[] = [];

  /**
   * Dispatches the startAppLoading action
   * @param store
   * @param dataService
   * @param utilService
   * @param animationService
   * @param cdRef
   */
  constructor(
    private readonly store: Store,
    private readonly dataService: DataService,
    private readonly utilService: UtilsService,
    private readonly animationService: AnimationsService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.animationService.watchResponse().subscribe((animationServiceResponse) => {
        this.onAnimationServiceResponse(animationServiceResponse);
      }),
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

        setTimeout(() => {
          this.introductionTime = true;

          if (this.waitingFor) {
            this[this.waitingFor]();
          }
        }, this.splashScreenDelay);
      }),
    );

    this.updateView();

    this.addEventListenersToWindow();

    this.store.dispatch(ApplicationActions.startAppLoading());
  }

  ngOnDestroy(): void {
    this.stopAutoHideHeaderTimeout();

    this.subscriptionList.forEach(s => s.unsubscribe());
    this.removeEventListenerFromWindow();
  }

  ngAfterViewChecked(): void {
    if (!this.mobileView) {
      if (!this.headerOnAnimation) {
        this.updateScrollingState();
      } else {
        this.scrollEnabled = false;
      }
      this.cdRef.detectChanges();
    }

  }

  public onAnimation = (e: any): void => this.animationService.onPhase(e);

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
    if (!animationServiceResponse.type || !animationServiceResponse.type.includes('hideShowHeader-')) {
      return;
    }

    if (animationServiceResponse.type.includes('start')) {
      this.headerOnAnimation = true;
    } else if (animationServiceResponse.type.includes('done')) {
      this.headerOnAnimation = false;
    }
  }

  private updateView(): void {
    this.pageYOffset = window.scrollY;
    this.mobileView = window.innerWidth <= 840;
    if (this.pageYOffset && !this.isHeaderHidden) {
      this.updateWrapperHeaderHeight();
      this.isHeaderHidden = true;
    }
    this.heightView = window.innerHeight;
    ContactOpenCloseService.setHeightIsTooSmall(this.heightView < this.minHeightView);
  }

  private updateWrapperHeaderHeight(): void {
    const appHeader = document.querySelector('.wrapper-header');
    if (appHeader) {
      const height = this.utilService.convertPixelsToNumber(window.getComputedStyle(appHeader).getPropertyValue('height'), true);
      if (!this.headerHeight.includes('' + height)) {
        this.headerHeight = `-${height}px`;
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

      this.scrollEnabled = this.getSectionHeight() - window.innerHeight > 0;
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
