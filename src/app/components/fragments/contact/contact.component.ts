import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment/moment';
import { Subscription } from 'rxjs';
import { APP_CREDITS, IContact, ICvInfos, IWebLink } from '../../../core';
import { IShareData } from '../../../core/interfaces/share-data.interface';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';
import { DataService, UtilsService, IN_OUT_TEMPLATE_ANIMATION, STAGGER_IN_OUT_TEMPLATE_ANIMATION, } from '../../../shared';

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

  contactMobileOpened = false;

  showContactBtns = false;

  subscriptionList: Subscription[] = [];

  contact: IContact = {} as IContact;

  webLinkList: IWebLink[] = [];

  loading = false;

  birthDate: Moment = {} as Moment;

  today: Moment = {} as Moment;

  heightIsTooSmall = false;

  innerHeight = 100;

  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService,
    private readonly contactOpenCloseService: ContactOpenCloseService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.contactOpenCloseService.onOpenCloseContactStatusChange()
        .subscribe(status => {
          if (this.contactMobileOpened !== status) {
            this.contactMobileOpened = status;
          }
        }),
    );

    this.subscriptionList.push(
      this.contactOpenCloseService.onHeightIsTooSmallChange()
        .subscribe(status => {
          if (this.heightIsTooSmall !== status) {
            this.heightIsTooSmall = status;
          }
        }),
    );

    this.contact = await this.dataService.getCvInfos<IContact>(true);
    this.webLinkList = this.contact?.webLinkList || [];

    if (this.contact) {
      this.birthDate = moment(this.contact.personalSituation.birthDate);
      this.today = moment();
    }

    this.innerHeight = window.innerHeight;
    window.addEventListener('resize', () => this.innerHeight = window.innerHeight);
  }

  ngOnDestroy() {
    this.subscriptionList.forEach(s => s.unsubscribe());
    window.removeEventListener('resize', () => this.innerHeight = window.innerHeight);
  }

  public onAnimation(event: any) {
    if (
      event.triggerName === 'ContactComponentMobileViewInOut' &&
      event.phaseName === 'done' &&
      event.toState === 'in' &&
      event.fromState === 'out'
    ) {
      this.showContactBtns = true;
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
      this.showContactBtns = false;
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
      title: APP_CREDITS.title + ' (' + APP_CREDITS.subTitle + ')',
      text: APP_CREDITS.fullName + ' | ' + APP_CREDITS.title,
      url: APP_CREDITS.webAppUrl,
    };
    await this.utilsService.share(shareData);
  }
}
