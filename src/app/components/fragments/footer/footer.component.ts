import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';

interface ITile {
  cols: number;

  rows: number;

  background: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() hideHeader = true;

  @Input() mobile = false;

  @Output() showHeader = new EventEmitter<boolean>();

  public heightIsTooSmall = false;

  public readonly classicTiles: ITile[] = [
    { // left => CV pdf
      cols: 1, rows: 1, background: 'white',
    },
    { // bottom => Copyright
      cols: 3, rows: 1, background: 'transparent',
    },
  ];

  public readonly mobileTiles: ITile[] = [
    { // bottom => Copyright
      cols: 2, rows: 1, background: 'transparent',
    },
    { // right => Contact
      cols: 1, rows: 1, background: 'rgba(2, 72, 115, 0.6)',
    },
  ];

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly contactOpenCloseService: ContactOpenCloseService,
  ) {
  }

  ngOnInit(): void {
    const heightIsTooSmallSubscription = this.contactOpenCloseService
      .onHeightIsTooSmallChange()
      .subscribe(status => {
        if (this.heightIsTooSmall !== status) {
          this.heightIsTooSmall = status;
        }
      });
    this.subscriptionList.push(heightIsTooSmallSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  public onShowHeader(): void {
    this.showHeader.emit(true);
  }

  public onOpenContact(): void {
    this.contactOpenCloseService.setOpenCloseContactStatus(true);
  }
}
