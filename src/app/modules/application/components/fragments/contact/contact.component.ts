import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { APP_CREDITS, IContact, IWebLink } from '../../../../../core';
import { IShareData } from '../../../../../core/interfaces/models/commons/share-data.interface';
import { CvInfosV1 } from '../../../../../core/interfaces/models/v1/cv-infos.interface';
import { selectAppCvInfosLoaded } from '../../../../../core/ngrx/selectors/application.selectors';
import { selectCvInfos } from '../../../../../core/ngrx/selectors/cv-infos.selectors';
import { ContactOpenCloseService } from '../../../../../core/services/contact-open-close/contact-open-close.service';
import {
  DataService,
  IN_OUT_TEMPLATE_ANIMATION,
  STAGGER_IN_OUT_TEMPLATE_ANIMATION,
  UtilsService,
} from '../../../../../shared';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    ...IN_OUT_TEMPLATE_ANIMATION(
      'ContactComponentMobileView',
      true,
      { in: 250, out: 750 },
      { style: { opacity: 1, display: 'flex' } },
    ),
    ...STAGGER_IN_OUT_TEMPLATE_ANIMATION(
      'MobileContactBtns',
      { in: '250ms cubic-bezier(0.35, 0, 0.25, 1)', out: '200ms cubic-bezier(0.35, 0, 0.25, 1)' },
      { in: '100ms', out: '100ms' },
      { style: { opacity: 1, transform: 'none' } },
      { style: { opacity: 0, transform: 'translateY(-50px)' } },
    ),
  ],
})
export class ContactComponent implements OnInit, OnDestroy {
  @Input() mobileView = false;

  public contact: IContact = {} as IContact;

  public webLinkList: IWebLink[] = [];

  public contactMobileOpened = false;

  public showContactButtons = false;

  public heightIsTooSmall = false;

  public innerHeight = 100;

  private loading = false;

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService,
    private readonly store: Store,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      ContactOpenCloseService.onOpenCloseContactStatusChange()
        .subscribe(status => {
          if (this.contactMobileOpened !== status) {
            this.contactMobileOpened = status;
          }
        }),
    );

    this.subscriptionList.push(
      ContactOpenCloseService.onHeightIsTooSmallChange()
        .subscribe(status => {
          if (this.heightIsTooSmall !== status) {
            this.heightIsTooSmall = status;
          }
        }),
    );

    this.innerHeight = window.innerHeight;
    window.addEventListener('resize', () => this.innerHeight = window.innerHeight);

    const cvInfos = await this.dataService.getStoreData({
      selector: selectCvInfos,
      defaultValue: undefined,
    });
    if (!cvInfos || !cvInfos.contact) {
      this.subscriptionList.push(
        this.store.select(selectAppCvInfosLoaded).subscribe((cvInfosLoaded) => {
          if (!cvInfosLoaded) {
            return;
          }

          this.dataService.getStoreData({
            selector: selectCvInfos,
            defaultValue: undefined,
          }).then((cvInfosSubscribed) => {
            this.initializeComponent(cvInfosSubscribed as CvInfosV1);
          });
        }),
      );
      return;
    }

    this.initializeComponent(cvInfos);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
    window.removeEventListener('resize', () => this.innerHeight = window.innerHeight);
  }

  public onAnimation(event: any): void {
    if (
      event.triggerName === 'ContactComponentMobileViewInOut' &&
      event.phaseName === 'done' &&
      event.toState === 'in' &&
      event.fromState === 'out'
    ) {
      this.showContactButtons = true;
    }

    if (
      event.triggerName === 'MobileContactBtnsInOut' &&
      event.phaseName === 'done' &&
      event.toState === false &&
      event.fromState === true
    ) {
      this.contactMobileOpened = false;
    }
  }

  public toggleContactMobileOpenClose(): void {
    if (this.contactMobileOpened) {
      this.showContactButtons = false;
    }
  }

  public call(): void {
    if (!this.loading) {
      setTimeout(() => {
        window.open('tel:' + this.contact.phoneNumberPartList.parts.join(
          this.contact.phoneNumberPartList.joiner,
        ));
        this.loading = false;
      }, 500);
    }
  }

  public sendMail(): void {
    if (!this.loading) {
      setTimeout(() => {
        window.open('mailto:' + this.contact.emailPartList.parts.join(
          this.contact.emailPartList.joiner,
        ));
        this.loading = false;
      }, 500);
    }
  }

  public openURL = (url: string) => this.utilsService.openURL(url);

  public async share(): Promise<void> {
    const shareData: IShareData = {
      title: `${APP_CREDITS.title}(${APP_CREDITS.subTitle})`,
      text: `${APP_CREDITS.fullName} | ${APP_CREDITS.title}`,
      url: APP_CREDITS.webAppUrl,
    };
    await this.utilsService.share(shareData);
  }

  private initializeComponent(cvInfos: CvInfosV1): void {
    this.contact = cvInfos.contact;
    this.webLinkList = this.contact?.webLinkList || [];
  }
}
